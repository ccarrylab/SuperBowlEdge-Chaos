# KMS key for Kinesis
resource "aws_kms_key" "kinesis" {
  description             = "KMS key for Kinesis Firehose encryption"
  deletion_window_in_days = 10
  enable_key_rotation     = true

  tags = local.common_tags
}

resource "aws_kinesis_firehose_delivery_stream" "waf_logs_secure" {
  name        = "${var.environment}-waf-logs-secure"
  destination = "extended_s3"

  server_side_encryption {
    enabled  = true
    key_type = "CUSTOMER_MANAGED_CMK"
    key_arn  = aws_kms_key.kinesis.arn
  }

  extended_s3_configuration {
    role_arn   = aws_iam_role.firehose.arn
    bucket_arn = aws_s3_bucket.logs.arn
    prefix     = "waf-logs/"

    compression_format = "GZIP"
  }
}
