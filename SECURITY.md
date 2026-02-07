# Security Policy

## Security Scanning Pipeline

This project implements a **tiered security approach** following DevOps and security best practices:

### 🔴 CRITICAL (Blocking)
These checks **MUST pass** before deployment:

- **Secret Scanning** (Gitleaks)
  - Blocks any hardcoded credentials, API keys, tokens
  - Scans entire git history
  - Zero tolerance policy

- **Critical CVE Dependencies** (npm audit)
  - Blocks dependencies with CRITICAL severity CVEs
  - Must be patched before merge

**Status**: Pipeline fails immediately if detected

### 🟠 HIGH (Blocking)
These checks **should pass** - require justification to bypass:

- **Infrastructure Security** (Checkov + tfsec)
  - Blocks misconfigurations (public S3, weak IAM, missing encryption)
  - Enforces AWS security best practices
  - Requires explicit waiver for exceptions

- **High Severity Vulnerabilities** (Trivy)
  - Blocks HIGH and CRITICAL CVEs
  - Scans dependencies, OS packages, IaC

**Status**: Pipeline fails, can be overridden with documented justification

### 🟡 MEDIUM (Advisory)
These checks provide **warnings** but don't block:

- **SAST Analysis** (Semgrep)
  - Identifies code quality and security issues
  - Reports XSS, injection risks, weak crypto
  - Reviewed but not blocking

- **Python Security** (Bandit + Safety)
  - Lambda function security analysis
  - Dependency vulnerability checks

**Status**: Issues logged, reviewed in PR process

### 🟢 LOW (Informational)
These provide **visibility** for continuous improvement:

- **Full Dependency Audit**
  - Reports all severity levels (including LOW)
  - Helps prioritize technical debt
  - Non-blocking

**Status**: Informational only

## Vulnerability Response SLA

| Severity | Response Time | Patch Time |
|----------|--------------|------------|
| CRITICAL | Immediate | 24 hours |
| HIGH | 24 hours | 7 days |
| MEDIUM | 1 week | 30 days |
| LOW | Best effort | 90 days |

## Reporting a Vulnerability

**Email**: cohen.carryl@gmail.com

**Include**:
- Description and impact
- Steps to reproduce
- Suggested remediation

**Response**: Within 48 hours

## Security Features

### Infrastructure
- ✅ HTTPS-only (CloudFront + ACM)
- ✅ AWS WAF (Layer 7 DDoS)
- ✅ CloudFront + Shield Standard (Layer 3/4 DDoS)
- ✅ VPC with restrictive security groups
- ✅ IAM least privilege roles
- ✅ Server-side encryption (S3)
- ✅ CloudWatch logging all services

### CI/CD
- ✅ GitHub OIDC (no long-lived credentials)
- ✅ Automated security scanning
- ✅ Dependency vulnerability checks
- ✅ Infrastructure security validation
- ✅ Secret detection
- ✅ SAST/DAST analysis

### Monitoring
- ✅ Real-time CloudWatch metrics
- ✅ AWS FIS chaos testing
- ✅ Automated alerting
- ✅ Security audit logs

## Compliance

This project follows:
- OWASP Top 10 guidelines
- CIS AWS Foundations Benchmark
- AWS Well-Architected Framework (Security Pillar)
- NIST Cybersecurity Framework principles

## Security Contacts

- **Project Owner**: Cohen Carryl
- **LinkedIn**: https://www.linkedin.com/in/cohen-h-carryl-3538b614/
- **Response Time**: 48 hours
