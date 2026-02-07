resource "aws_lb" "main_secure" {
  name               = "${var.environment}-alb-secure"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_secure.id]
  subnets            = module.vpc.public_subnets

  drop_invalid_header_fields = true  # FIX: Drop invalid headers

  enable_deletion_protection = false
  enable_http2              = true

  access_logs {
    bucket  = aws_s3_bucket.logs.id
    prefix  = "alb"
    enabled = true
  }

  tags = local.common_tags
}
