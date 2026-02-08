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
        Action   = ["fis:ListExperiments", "fis:GetExperiment", "fis:StartExperiment", "fis:StopExperiment", "fis:ListExperimentTemplates", "fis:GetExperimentTemplate"]
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
  function_name = "${var.project_name}-${var.environment}-metrics-api"
  role          = aws_iam_role.lambda_metrics.arn
  handler       = "metrics.lambda_handler"
  runtime       = "python3.11"
  timeout       = 30
  memory_size   = 128

  filename         = "${path.module}/lambda/metrics-lambda.zip"
  source_code_hash = filebase64sha256("${path.module}/lambda/metrics-lambda.zip")

  environment {
    variables = {
      DISTRIBUTION_ID = aws_cloudfront_distribution.main.id
      ALB_ARN         = aws_lb.main.arn
      ASG_NAME        = aws_autoscaling_group.haproxy.name
    }
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-metrics-api"
  }
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
  api_id    = aws_apigatewayv2_api.metrics.id
  route_key = "GET /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.metrics.id}"
}

resource "aws_apigatewayv2_route" "metrics_post" {
  api_id    = aws_apigatewayv2_api.metrics.id
  route_key = "POST /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.metrics.id}"
}

resource "aws_apigatewayv2_stage" "prod" {
  api_id      = aws_apigatewayv2_api.metrics.id
  name        = "prod"
  auto_deploy = true
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
