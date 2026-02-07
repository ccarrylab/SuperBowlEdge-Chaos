# KMS key for CloudWatch Logs encryption
resource "aws_kms_key" "cloudwatch_logs" {
  description             = "KMS key for CloudWatch Logs encryption"
  deletion_window_in_days = 10
  enable_key_rotation     = true

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "Enable IAM User Permissions"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Action   = "kms:*"
        Resource = "*"
      },
      {
        Sid    = "Allow CloudWatch Logs"
        Effect = "Allow"
        Principal = {
          Service = "logs.amazonaws.com"
        }
        Action = [
          "kms:Encrypt",
          "kms:Decrypt",
          "kms:ReEncrypt*",
          "kms:GenerateDataKey*",
          "kms:CreateGrant",
          "kms:DescribeKey"
        ]
        Resource = "*"
        Condition = {
          ArnLike = {
            "kms:EncryptionContext:aws:logs:arn" = "arn:aws:logs:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:*"
          }
        }
      }
    ]
  })

  tags = local.common_tags
}

resource "aws_kms_alias" "cloudwatch_logs" {
  name          = "alias/${var.environment}-cloudwatch-logs"
  target_key_id = aws_kms_key.cloudwatch_logs.key_id
}

# Update CloudWatch Log Groups with encryption and retention
resource "aws_cloudwatch_log_group" "haproxy_secure" {
  name              = "/aws/ec2/${var.environment}/haproxy"
  retention_in_days = 365  # 1 year retention
  kms_key_id        = aws_kms_key.cloudwatch_logs.arn

  tags = local.common_tags
}

resource "aws_cloudwatch_log_group" "alb_secure" {
  name              = "/aws/elasticloadbalancing/${var.environment}"
  retention_in_days = 365  # 1 year retention
  kms_key_id        = aws_kms_key.cloudwatch_logs.arn

  tags = local.common_tags
}

resource "aws_cloudwatch_log_group" "fis_secure" {
  name              = "/aws/fis/${var.environment}"
  retention_in_days = 365  # 1 year retention
  kms_key_id        = aws_kms_key.cloudwatch_logs.arn

  tags = local.common_tags
}
