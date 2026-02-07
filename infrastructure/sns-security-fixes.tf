# KMS key for SNS encryption
resource "aws_kms_key" "sns" {
  description             = "KMS key for SNS encryption"
  deletion_window_in_days = 10
  enable_key_rotation     = true

  tags = local.common_tags
}

resource "aws_sns_topic" "alerts_secure" {
  name              = "${var.environment}-chaos-alerts-secure"
  kms_master_key_id = aws_kms_key.sns.id

  tags = local.common_tags
}

resource "aws_sns_topic" "chaos_alerts_secure" {
  name              = "${var.environment}-fis-alerts-secure"
  kms_master_key_id = aws_kms_key.sns.id

  tags = local.common_tags
}
