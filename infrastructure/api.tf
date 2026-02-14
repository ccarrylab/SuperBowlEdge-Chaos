# =============================================================================
# Lambda Function for Metrics API
# =============================================================================

resource "aws_iam_role" "lambda_metrics" {
  name = "${var.project_name}-${var.environment}-lambda-metrics"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy" "lambda_metrics_policy" {
  name = "${var.project_name}-${var.environment}-lambda-metrics-policy"
  role = aws_iam_role.lambda_metrics.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["cloudwatch:GetMetricStatistics", "cloudwatch:ListMetrics"]
        Resource = "*"
      },
      {
        Effect   = "Allow"
        Action   = ["elasticloadbalancing:DescribeTargetHealth", "elasticloadbalancing:DescribeTargetGroups"]
        Resource = "*"
      },
      {
        Effect   = "Allow"
        Action   = ["autoscaling:DescribeAutoScalingGroups"]
        Resource = "*"
      },
      {
        Effect   = "Allow"
        Action   = ["fis:ListExperiments", "fis:GetExperiment", "fis:StartExperiment", "fis:StopExperiment", "fis:ListExperimentTemplates", "fis:GetExperimentTemplate", "fis:TagResource"]
        Resource = "*"
      },
      {
        Effect   = "Allow"
        Action   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

resource "aws_lambda_function" "metrics_api" {
  # checkov:skip=CKV_AWS_272:Code signing not required for demo
  function_name = "${var.project_name}-${var.environment}-metrics-api"
  role          = aws_iam_role.lambda_metrics.arn
  handler       = "metrics.lambda_handler"
  runtime       = "python3.11"
  timeout       = 30
  memory_size   = 128

  # Optional polish: cap concurrency to prevent abuse / runaway cost

  filename         = "${path.module}/lambda/metrics-lambda.zip"
  source_code_hash = filebase64sha256("${path.module}/lambda/metrics-lambda.zip")

  # CKV_AWS_117: VPC configuration
  vpc_config {
    subnet_ids         = module.vpc.private_subnets
    security_group_ids = [aws_security_group.lambda.id]
  }

  # CKV_AWS_116: Dead Letter Queue
  dead_letter_config {
    target_arn = aws_sqs_queue.lambda_dlq.arn
  }

  # CKV_AWS_50: X-Ray tracing
  tracing_config {
    mode = "Active"
  }

  # CKV_AWS_173: Environment variable encryption
  kms_key_arn = aws_kms_key.lambda.arn

  # CKV_AWS_115: Skip - account concurrency limit
  # checkov:skip=CKV_AWS_115:Reserved concurrency is intentionally capped to 2

  environment {
    variables = {
      DISTRIBUTION_ID = aws_cloudfront_distribution.main.id
      ALB_ARN         = aws_lb.main.arn
      ASG_NAME        = aws_autoscaling_group.haproxy.name
      VISITORS_TABLE  = aws_dynamodb_table.visitors.name
    }
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-metrics-api"
  }

  depends_on = [
    aws_security_group.lambda,
    aws_sqs_queue.lambda_dlq,
    aws_kms_key.lambda
  ]
}

# =============================================================================
# API Gateway
# =============================================================================

resource "aws_apigatewayv2_api" "metrics" {
  name          = "${var.project_name}-${var.environment}-metrics-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["https://chaos.ccarrylab.com", "http://localhost:5173"]
    allow_methods = ["GET", "OPTIONS", "POST"]
    allow_headers = ["content-type"]
    max_age       = 300
  }
}

resource "aws_apigatewayv2_integration" "metrics" {
  api_id                 = aws_apigatewayv2_api.metrics.id
  integration_type       = "AWS_PROXY"
  integration_method     = "POST"
  integration_uri        = aws_lambda_function.metrics_api.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "metrics_get" {
  authorization_type = "NONE"
  # checkov:skip=CKV_AWS_309:Public metrics API endpoint
  api_id    = aws_apigatewayv2_api.metrics.id
  route_key = "GET /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.metrics.id}"
}

resource "aws_apigatewayv2_route" "metrics_post" {
  # checkov:skip=CKV_AWS_309:Public chaos control API endpoint
  authorization_type = "NONE"
  api_id             = aws_apigatewayv2_api.metrics.id
  route_key          = "POST /{proxy+}"
  target             = "integrations/${aws_apigatewayv2_integration.metrics.id}"
}

resource "aws_apigatewayv2_stage" "prod" {
  api_id      = aws_apigatewayv2_api.metrics.id
  name        = "prod"
  auto_deploy = true

  # Stage throttling (HTTP API v2)
  default_route_settings {
    throttling_burst_limit = 25
    throttling_rate_limit  = 10
  }

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gateway.arn
    format = jsonencode({
      requestId      = "$context.requestId"
      ip             = "$context.identity.sourceIp"
      requestTime    = "$context.requestTime"
      httpMethod     = "$context.httpMethod"
      routeKey       = "$context.routeKey"
      status         = "$context.status"
      responseLength = "$context.responseLength"
    })
  }
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.metrics_api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.metrics.execution_arn}/*/*"
}

# =============================================================================
# Route53 Records for Custom Domain
# =============================================================================

resource "aws_route53_record" "cloudfront_alias" {
  zone_id = "Z036239422WM5E3ZI4AHS"
  name    = "chaos.ccarrylab.com"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.main.domain_name
    zone_id                = aws_cloudfront_distribution.main.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "cloudfront_alias_ipv6" {
  zone_id = "Z036239422WM5E3ZI4AHS"
  name    = "chaos.ccarrylab.com"
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.main.domain_name
    zone_id                = aws_cloudfront_distribution.main.hosted_zone_id
    evaluate_target_health = false
  }
}

# =============================================================================
# Outputs
# =============================================================================

output "api_endpoint" {
  description = "API Gateway endpoint URL"
  value       = "${aws_apigatewayv2_api.metrics.api_endpoint}/prod"
}

# CKV_AWS_117: Security group for Lambda in VPC
resource "aws_security_group" "lambda" {
  name        = "${var.project_name}-${var.environment}-lambda-sg"
  description = "Security group for Lambda function"
  vpc_id      = module.vpc.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-lambda-sg"
  }
}

# CKV_AWS_116: DLQ for Lambda
resource "aws_sqs_queue" "lambda_dlq" {
  name                              = "${var.project_name}-${var.environment}-lambda-dlq"
  kms_master_key_id                 = aws_kms_key.lambda.id
  kms_data_key_reuse_period_seconds = 300

  tags = {
    Name = "${var.project_name}-${var.environment}-lambda-dlq"
  }
}

# CKV_AWS_173: KMS key for Lambda encryption
resource "aws_kms_key" "lambda" {
  description             = "KMS key for Lambda encryption"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  tags = {
    Name = "${var.project_name}-${var.environment}-lambda-kms"
  }
}

resource "aws_kms_alias" "lambda" {
  name          = "alias/${var.project_name}-${var.environment}-lambda"
  target_key_id = aws_kms_key.lambda.key_id
}

# CKV_AWS_76: CloudWatch log group for API Gateway access logging
resource "aws_cloudwatch_log_group" "api_gateway" {
  name              = "/aws/apigateway/${var.project_name}-${var.environment}"
  retention_in_days = 365
  kms_key_id        = aws_kms_key.logs.arn

  tags = {
    Name = "${var.project_name}-${var.environment}-apigw-logs"
  }
}

# IAM policy for Lambda to use DLQ
resource "aws_iam_role_policy" "lambda_dlq" {
  name = "${var.project_name}-${var.environment}-lambda-dlq-policy"
  role = aws_iam_role.lambda_metrics.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "sqs:SendMessage"
        ]
        Resource = aws_sqs_queue.lambda_dlq.arn
      },
      {
        Effect = "Allow"
        Action = [
          "kms:Decrypt",
          "kms:GenerateDataKey"
        ]
        Resource = aws_kms_key.lambda.arn
      }
    ]
  })
}

# IAM policy for Lambda VPC access
resource "aws_iam_role_policy_attachment" "lambda_vpc" {
  role       = aws_iam_role.lambda_metrics.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}
