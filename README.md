# SuperBowl Edge - Chaos Engineering Platform

Production-grade chaos engineering with real-time AWS metrics.

**Live:** [https://chaos.ccarrylab.com](https://chaos.ccarrylab.com)

## Features
- Real-time metrics API (CloudWatch, ALB, ASG, FIS)
- Custom domain with SSL
- Multi-AZ infrastructure
- Chaos experiments

## Structure
- `infrastructure/` - Terraform
- `app/` - React dashboard
- API: https://ke2z9vq7tk.execute-api.us-east-1.amazonaws.com/prod

## Author
Cohen Carryl - Senior DevOps Engineer

## Security Posture

[![Security Checks](https://github.com/ccarrylab/SuperBowlEdge-Chaos/actions/workflows/security.yml/badge.svg)](https://github.com/ccarrylab/SuperBowlEdge-Chaos/actions/workflows/security.yml)

### Automated Security Scanning

**Tiered Security Approach:**

🔴 **CRITICAL** (Blocking)
- Secret scanning (Gitleaks)
- Critical CVE dependencies

🟠 **HIGH** (Blocking)
- Infrastructure misconfigurations (Checkov, tfsec)
- High severity vulnerabilities (Trivy)

🟡 **MEDIUM** (Advisory)
- SAST code analysis (Semgrep)
- Python security (Bandit)

🟢 **LOW** (Informational)
- Full dependency audit
- Continuous monitoring

See [SECURITY.md](SECURITY.md) for complete security policy.
