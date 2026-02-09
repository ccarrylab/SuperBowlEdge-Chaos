resource "aws_dynamodb_table" "visitors" {
  name         = "${var.project_name}-${var.environment}-visitors"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "visitor_id"
  range_key    = "timestamp"

  attribute {
    name = "visitor_id"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "N"
  }

  attribute {
    name = "date"
    type = "S"
  }

  attribute {
    name = "week"
    type = "S"
  }

  global_secondary_index {
    name            = "DateIndex"
    hash_key        = "date"
    range_key       = "timestamp"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "WeekIndex"
    hash_key        = "week"
    range_key       = "timestamp"
    projection_type = "ALL"
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  point_in_time_recovery {
    enabled = true
  }

  server_side_encryption {
    enabled     = true
    kms_key_arn = aws_kms_key.dynamodb_visitors.arn
  }

  tags = {
    Name        = "${var.project_name}-visitors"
    Environment = var.environment
  }
}

resource "aws_kms_key" "dynamodb_visitors" {
  description             = "KMS key for DynamoDB visitor tracking"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  tags = {
    Name        = "${var.project_name}-dynamodb-visitors-kms"
    Environment = var.environment
  }
}

resource "aws_kms_alias" "dynamodb_visitors" {
  name          = "alias/${var.project_name}-dynamodb-visitors"
  target_key_id = aws_kms_key.dynamodb_visitors.key_id
}

resource "aws_iam_role_policy" "lambda_dynamodb_visitors" {
  name = "${var.project_name}-${var.environment}-lambda-dynamodb-visitors"
  role = aws_iam_role.lambda_metrics.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = [
          aws_dynamodb_table.visitors.arn,
          "${aws_dynamodb_table.visitors.arn}/index/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "kms:Decrypt",
          "kms:GenerateDataKey"
        ]
        Resource = aws_kms_key.dynamodb_visitors.arn
      }
    ]
  })
}

output "visitors_table_name" {
  description = "DynamoDB table name for visitor tracking"
  value       = aws_dynamodb_table.visitors.name
}
