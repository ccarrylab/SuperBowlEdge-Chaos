# SuperBowl Edge - Chaos Engineering Platform

Production-grade chaos engineering platform at Super Bowl scale with real-time AWS metrics.

**Live Demo:** https://chaos.ccarrylab.com

## Features

- Real-time AWS metrics from CloudWatch, ALB, ASG
- Custom domain with SSL (chaos.ccarrylab.com)
- Chaos engineering with AWS FIS
- Multi-AZ high availability (99.99% uptime)
- 100% Terraform Infrastructure as Code
- Animated React dashboard
- Comprehensive security scanning

## Architecture
```
CloudFront CDN → WAF → API Gateway → ALB → HAProxy ASG → Nginx
```

## Tech Stack

**Infrastructure:** Terraform, HAProxy, Nginx, AWS (13 services)

**Frontend:** React 19, TypeScript, Tailwind CSS, Framer Motion

**Backend:** Python 3.11, Lambda, API Gateway

**Security:** Checkov, tfsec, Gitleaks, KMS encryption

## Quick Start
```bash
# Deploy infrastructure
cd infrastructure
terraform init
terraform apply

# Deploy dashboard
cd ../app
npm install
npm run build
aws s3 sync dist/ s3://superbowl-edge-dev-content-089719647189/ --delete
aws cloudfront create-invalidation --distribution-id E3EHW9FZ4D82AY --paths "/*"
```

## Security

- 121/121 security checks passing
- Automated scanning (Checkov, tfsec, Gitleaks)
- KMS encryption at rest
- TLS 1.2+ in transit
- No secrets in code (OIDC)
- 365-day log retention

## Cost

~$150-200/month
- CloudFront: $50
- EC2: $50-100
- ALB: $25
- Other: $25

## Author

**Cohen Carryl** - Senior DevOps Engineer

7+ years multi-cloud infrastructure | 11 AWS/GCP/Oracle certifications

[LinkedIn](https://www.linkedin.com/in/cohen-h-carryl-3538b614/)
