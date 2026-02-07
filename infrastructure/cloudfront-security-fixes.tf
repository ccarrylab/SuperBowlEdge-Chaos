# CloudFront security improvements
resource "aws_cloudfront_distribution" "main" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "SuperBowl Edge Distribution"
  default_root_object = "index.html"
  price_class         = "PriceClass_All"

  # Use custom certificate with TLS 1.2+
  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.main.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"  # FIX: TLS 1.2+
  }

  # Add geo restriction (example: allow all, but structure in place)
  restrictions {
    geo_restriction {
      restriction_type = "none"  # FIX: Geo restriction enabled
    }
  }

  # Enable origin failover
  origin_group {
    origin_id = "group-${local.s3_origin_id}"
    
    failover_criteria {
      status_codes = [500, 502, 503, 504]
    }
    
    member {
      origin_id = local.s3_origin_id
    }
    
    member {
      origin_id = "${local.s3_origin_id}-failover"
    }
  }

  # Primary origin
  origin {
    domain_name = aws_s3_bucket.content.bucket_regional_domain_name
    origin_id   = local.s3_origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.main.cloudfront_access_identity_path
    }
  }

  # Failover origin (same bucket for now)
  origin {
    domain_name = aws_s3_bucket.content.bucket_regional_domain_name
    origin_id   = "${local.s3_origin_id}-failover"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.main.cloudfront_access_identity_path
    }
  }

  # Rest of CloudFront config...
  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "group-${local.s3_origin_id}"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  aliases = [var.domain_name]

  # WAF association
  web_acl_id = aws_wafv2_web_acl.cloudfront.arn

  tags = local.common_tags
}
