# Branch Protection Rules

## Main Branch

Configure these settings in GitHub:

### Required
- ✅ Require pull request reviews before merging (1 approval)
- ✅ Require status checks to pass before merging
  - Terraform CI
  - React CI
  - Secret Scanning
  - CodeQL Analysis
- ✅ Require branches to be up to date before merging
- ✅ Require conversation resolution before merging

### Recommended
- ✅ Require signed commits
- ✅ Include administrators
- ✅ Restrict who can push to matching branches

### Status Checks Required
1. `terraform / Terraform Validation`
2. `build / Build and Test`
3. `secret-scanning / Secret Scanning`
4. `analyze / CodeQL Analysis`
