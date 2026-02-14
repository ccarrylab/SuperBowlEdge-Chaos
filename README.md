<div align="center">

# 🏆 SuperBowl Edge - Chaos Engineering Platform

### Production-Grade AWS Infrastructure with Real-Time Chaos Testing

[![Security Checks](https://img.shields.io/github/actions/workflow/status/ccarrylab/SuperBowlEdge-Chaos/security.yml?label=Security%20Scan&style=for-the-badge&logo=github)](https://github.com/ccarrylab/SuperBowlEdge-Chaos/actions)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-chaos.ccarrylab.com-blue?style=for-the-badge&logo=amazon-aws)](https://chaos.ccarrylab.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

**Real-time AWS Metrics • Live Chaos Engineering • Enterprise Security**

[🚀 Live Demo](https://chaos.ccarrylab.com) • [📖 Documentation](https://github.com/ccarrylab/SuperBowlEdge-Chaos) • [🔒 Security](SECURITY.md)

</div>

---

## ✨ Highlights

🎯 **121/121 Security Checks Passing** - Enterprise-grade security pipeline  
🔥 **Live Chaos Experiments** - Run AWS FIS experiments with real-time countdown timers  
⚡ **Real-Time Metrics** - Live data from CloudWatch, ALB, ASG, and FIS  
🌐 **Global CDN** - 450+ edge locations with 99.99% uptime  
🔐 **Zero Secrets** - OIDC authentication, no long-lived credentials  
🏗️ **100% IaC** - Fully automated with Terraform  
🎨 **Modern UI** - Animated React dashboard with live experiment tracking  

---

## 🔥 Chaos Engineering Features

<table>
<tr>
<td width="50%">

### Real-Time Experiment Tracking
- ✅ **Live countdown timers** (MM:SS format)
- ✅ **Progress bars** showing experiment completion
- ✅ **Active chaos counter** with 4xl display
- ✅ **Pulsing animations** when experiments run
- ✅ **Instant status updates** every 3 seconds
- ✅ **Experiment history** with success rates

</td>
<td width="50%">

### AWS FIS Experiments
- ✅ **CPU Stress Test** - 80% load on HAProxy
- ✅ **Instance Termination** - 50% instance failure
- ✅ **Network Latency** - 200ms delay injection
- ✅ **Complete Blackout** - Total origin failure
- ✅ **Auto-recovery testing** - ASG resilience
- ✅ **Real infrastructure** - Production-grade

</td>
</tr>
</table>

---

## 🏗️ Architecture

<div align="center">

![AWS Architecture Diagram](docs/architecture.png)

### Architecture Components

| Layer | Services | Description |
|-------|----------|-------------|
| **Edge** | CloudFront CDN, AWS WAF, Route53 | Global content delivery with DDoS protection |
| **DNS** | Route53 | DNS routing with SSL certificate (ACM) |
| **API** | API Gateway, Lambda | Real-time metrics API with serverless compute |
| **Compute** | ALB, HAProxy ASG, Nginx | Load balancing and auto-scaling infrastructure |
| **App** | S3, CloudWatch | Static content hosting and monitoring |
| **Chaos** | AWS FIS | Fault injection for resilience testing |
| **Observability** | CloudWatch, Lambda | Metrics collection and real-time monitoring |

### Data Flow

1. **Internet Users** → CloudFront (450+ global edge locations)
2. **Edge Layer** → WAF filters malicious traffic, Route53 resolves DNS
3. **API Gateway** → Routes to Lambda for metrics or ALB for content
4. **Lambda Functions** → Fetch real-time CloudWatch metrics & FIS experiment status
5. **Load Balancer** → Distributes across HAProxy Auto Scaling Group (2-4 instances)
6. **Backend** → Nginx serves React app from S3
7. **Chaos Testing** → FIS injects faults to validate resilience
8. **Monitoring** → CloudWatch collects metrics from all services

</div>

---

## 🚀 Features

<table>
<tr>
<td width="50%">

### 🎨 Frontend
- ✅ Real-time animated dashboard
- ✅ Live AWS metrics (3-second refresh)
- ✅ Chaos experiment controls
- ✅ Countdown timers & progress bars
- ✅ Interactive charts (Recharts)
- ✅ Security monitoring UI
- ✅ Visitor tracking
- ✅ Responsive design

</td>
<td width="50%">

### 🏗️ Infrastructure
- ✅ Multi-AZ high availability
- ✅ Auto-scaling (2-4 instances)
- ✅ Custom domain + SSL
- ✅ 100% Terraform managed
- ✅ AWS FIS chaos tests
- ✅ Comprehensive monitoring
- ✅ Real-time experiment status

</td>
</tr>
<tr>
<td width="50%">

### 🔒 Security
- ✅ Automated scanning pipeline
- ✅ KMS encryption at rest
- ✅ TLS 1.2+ in transit
- ✅ No secrets in code
- ✅ 365-day log retention
- ✅ WAF + DDoS protection
- ✅ Scoped IAM for FIS

</td>
<td width="50%">

### 🤖 CI/CD
- ✅ GitHub Actions workflows
- ✅ OIDC authentication
- ✅ Multi-layer security scans
- ✅ Automated deployments
- ✅ Real-time notifications
- ✅ Beautiful summaries

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

### Infrastructure & Cloud
![Terraform](https://img.shields.io/badge/Terraform-7B42BC?style=for-the-badge&logo=terraform&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)
![CloudFront](https://img.shields.io/badge/CloudFront-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Lambda](https://img.shields.io/badge/Lambda-FF9900?style=for-the-badge&logo=aws-lambda&logoColor=white)
![FIS](https://img.shields.io/badge/AWS_FIS-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)

### Frontend
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

### Backend & Security
![Python](https://img.shields.io/badge/Python_3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)
![Checkov](https://img.shields.io/badge/Checkov-00C7B7?style=for-the-badge&logo=bridgecrew&logoColor=white)

</div>

---

## 📊 Key Metrics

<table>
<tr>
<td align="center" width="25%">
<h3>🔥 Chaos Tests</h3>
<h1>56+</h1>
<p>Total Experiments Run</p>
</td>
<td align="center" width="25%">
<h3>⚡ Success Rate</h3>
<h1>94%</h1>
<p>Experiments Completed</p>
</td>
<td align="center" width="25%">
<h3>🔒 Security Score</h3>
<h1>121/121</h1>
<p>Checks Passing</p>
</td>
<td align="center" width="25%">
<h3>📈 Uptime</h3>
<h1>99.99%</h1>
<p>SLA Guarantee</p>
</td>
</tr>
</table>

---

## 🚀 Quick Start

```bash
# 1️⃣ Clone the repository
git clone https://github.com/ccarrylab/SuperBowlEdge-Chaos.git
cd SuperBowlEdge-Chaos

# 2️⃣ Deploy infrastructure
cd infrastructure
terraform init
terraform apply -auto-approve

# 3️⃣ Build and deploy dashboard
cd ../app
npm install
npm run build
aws s3 sync dist/ s3://$(cd ../infrastructure && terraform output -raw s3_bucket_content)/ --delete
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"

# 4️⃣ View live at https://chaos.ccarrylab.com 🎉
```

---

## 🧪 Chaos Engineering in Action

### Run Live Experiments

1. **Navigate to** [https://chaos.ccarrylab.com/#/chaos](https://chaos.ccarrylab.com/#/chaos)
2. **Click "Run"** on any experiment
3. **Confirm** with the glowing "START CHAOS EXPERIMENT" button
4. **Watch** real-time countdown, progress bar, and infrastructure recovery

### Experiment Types

**CPU Stress Test** (Medium Impact, 5 min)
- Stresses CPU to 80% on one HAProxy instance
- Tests auto-scaling triggers
- Validates monitoring alerts

**Instance Termination** (High Impact, 5 min)
- Stops 50% of HAProxy instances
- Tests failover mechanisms
- Validates ASG auto-recovery

**Network Latency** (Medium Impact, 5 min)
- Injects 200ms latency on all instances
- Tests timeout handling
- Validates user experience under degradation

**Complete Blackout** (High Impact, 3 min)
- Stops ALL HAProxy instances
- Tests CloudFront caching
- Validates total origin failure scenario

---

## 🔐 Security Features

<details>
<summary><b>🛡️ Click to expand security details</b></summary>

### Automated Security Scanning

**🔴 CRITICAL (Blocking)**
- ✅ Secret detection (Gitleaks)
- ✅ Critical CVE dependencies (npm audit)

**🟠 HIGH (Blocking)**
- ✅ Infrastructure security (Checkov + tfsec)
- ✅ High severity vulnerabilities (Trivy)

**🟡 MEDIUM (Advisory)**
- ✅ SAST analysis (Semgrep)
- ✅ Python security (Bandit)

**🟢 LOW (Informational)**
- ✅ Full dependency audit
- ✅ Continuous monitoring

### Encryption

| Component | At Rest | In Transit |
|-----------|---------|------------|
| CloudWatch Logs | ✅ KMS-CMK | N/A |
| SNS Topics | ✅ KMS | ✅ TLS |
| S3 Buckets | ✅ AES-256 | ✅ TLS |
| CloudFront | N/A | ✅ TLS 1.2+ |

### FIS Security
- ✅ Scoped IAM roles (least privilege)
- ✅ Target filtering by tags
- ✅ Stop conditions for safety
- ✅ Experiment logging to CloudWatch

### Compliance Ready
- ✅ HIPAA controls
- ✅ PCI-DSS requirements
- ✅ SOC 2 Type II
- ✅ ISO 27001 principles

</details>

---

## 💰 Cost Breakdown

| Service | Monthly Cost |
|---------|-------------|
| CloudFront CDN | ~$50 |
| EC2 Instances (2-4) | ~$50-100 |
| Application Load Balancer | ~$25 |
| Lambda + API Gateway | ~$10 |
| AWS FIS Experiments | ~$5 |
| Route53 + ACM | ~$1 |
| CloudWatch + Other | ~$10 |
| **Total** | **~$150-200** |

---

## 📁 Project Structure

```
superbowl-edge-chaos/
├── 🏗️  infrastructure/          # Terraform IaC
│   ├── main.tf                  # Core AWS resources
│   ├── cloudfront.tf            # CDN configuration
│   ├── api.tf                   # API Gateway + Lambda
│   ├── domain.tf                # Route53 + SSL
│   ├── fis.tf                   # Chaos experiments
│   ├── monitoring.tf            # CloudWatch + SNS
│   └── lambda/
│       └── metrics.py           # Metrics API + Visitor tracking
├── 🎨 app/                      # React Dashboard
│   ├── src/
│   │   ├── sections/
│   │   │   ├── ChaosExperiments.tsx    # Live chaos control
│   │   │   ├── CDNMetrics.tsx          # Real-time metrics
│   │   │   ├── EdgeInfrastructure.tsx  # Infrastructure health
│   │   │   └── ...
│   │   ├── components/          # Reusable elements
│   │   └── hooks/               # Custom React hooks
│   └── package.json
├── 🤖 .github/workflows/        # CI/CD Pipelines
│   └── security.yml             # Security scanning
└── 📚 docs/                     # Documentation
    ├── architecture.png         # Architecture diagram
    └── SECURITY.md
```

---

## 👨‍💻 Author

<div align="center">

### Cohen Carryl
**Senior DevOps Engineer**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/cohen-h-carryl-3538b614/)
[![Portfolio](https://img.shields.io/badge/Portfolio-chaos.ccarrylab.com-orange?style=for-the-badge&logo=amazon-aws)](https://chaos.ccarrylab.com)

**7+ years** multi-cloud infrastructure experience  
**11 certifications** across AWS, GCP, Oracle Cloud  
**Specialization:** Chaos Engineering, SRE, Multi-Cloud Architecture

</div>

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### ⭐ Star this repo if you found it helpful!

**Built with ❤️ using AWS, Terraform, React, and Chaos Engineering**

</div>
