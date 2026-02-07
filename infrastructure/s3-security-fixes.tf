resource "aws_s3_bucket_public_access_block" "logs_secure" {
  bucket = aws_s3_bucket.logs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true  # FIX: Ignore public ACLs
  restrict_public_buckets = true
}
