# CI/CD Pipeline Documentation

## Overview

This project implements a comprehensive CI/CD pipeline with integrated SAST (Static Application Security Testing) security scanning. The pipeline is orchestrated through GitHub Actions and enforces security best practices at multiple stages.

## Pipeline Architecture

### Workflow Triggers

The pipeline executes on:

- **Push events** to `main` or `master` branches
- **Pull request events** targeting `main` or `master` branches
- **Manual dispatch** via GitHub Actions UI

### Pipeline Stages

```
┌─────────────────────────────────────────────────────────────┐
│  Stage 1: CI & Testing                                      │
│  - Checkout code                                            │
│  - Install dependencies (backend + frontend)                │
│  - Run linting checks                                       │
│  - Execute unit tests                                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Stage 2: SAST - Security Scanning (Parallel)               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  2A: Dependency Scanning (npm audit)                 │   │
│  │  - Scan backend dependencies                         │   │
│  │  - Scan frontend dependencies                        │   │
│  │  - Fail on HIGH/CRITICAL vulnerabilities             │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  2B: Code Analysis (CodeQL)                          │   │
│  │  - Static code analysis for JavaScript               │   │
│  │  - Security and quality queries                      │   │
│  │  - Upload results to GitHub Security tab             │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  2C: Code Quality & Security (SonarCloud)            │   │
│  │  - Comprehensive code quality analysis               │   │
│  │  - Security vulnerability detection                  │   │
│  │  - Code coverage tracking                            │   │
│  │  - Quality gate enforcement                          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Stage 3: Build Docker Images                               │
│  - Build backend Docker image                               │
│  - Build frontend Docker image                              │
│  - Cache layers for faster builds                           │
│  - Save images as artifacts                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Stage 4: Container Security Scanning (Trivy)               │
│  - Load built Docker images                                 │
│  - Scan for OS vulnerabilities                              │
│  - Scan for package vulnerabilities                         │
│  - Fail on HIGH/CRITICAL findings                           │
│  - Upload results to GitHub Security tab                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Stage 5: Delivery (Push events only)                       │
│  - Login to Docker Hub                                      │
│  - Tag images with SHA and latest                           │
│  - Push images to Docker Hub registry                       │
└─────────────────────────────────────────────────────────────┘
```

## Security Scanning Deep Dive

### 1. Dependency Vulnerability Scanning (npm audit)

**Tool**: npm audit (native npm security tool)

**What it does**:

- Analyzes `package-lock.json` for known vulnerabilities in dependencies
- Checks against the npm Advisory Database
- Reports severity levels: LOW, MODERATE, HIGH, CRITICAL

**Configuration**:

```bash
npm audit --production --audit-level=high
```

- `--production`: Only scans production dependencies (excludes devDependencies)
- `--audit-level=high`: **Fails the build** if HIGH or CRITICAL vulnerabilities are found

**Pipeline behavior**:

- ✅ **Pass**: No vulnerabilities OR only LOW/MODERATE
- ❌ **Fail**: Any HIGH or CRITICAL vulnerabilities detected
- Generates JSON reports uploaded as artifacts for review

---

### 2. Static Application Security Testing (CodeQL)

**Tool**: GitHub CodeQL (by GitHub Security Lab)

**What it does**:

- Semantic code analysis to detect security vulnerabilities
- Identifies:
  - SQL injection
  - Cross-site scripting (XSS)
  - Path traversal
  - Command injection
  - Insecure cryptography
  - Sensitive data exposure
  - And 200+ security patterns

**Configuration**:

```yaml
queries: security-and-quality
language: javascript
```

**Pipeline behavior**:

- Scans JavaScript/TypeScript codebase
- Results uploaded to **GitHub Security → Code scanning alerts**
- Does NOT fail the build (informational)
- Provides actionable remediation guidance

---

### 3. Docker Image Vulnerability Scanning (Trivy)

**Tool**: Trivy

**What it does**:

- Scans Docker images for:
  - OS package vulnerabilities (Alpine, Debian, etc.)
  - Application dependencies (npm, pip, etc.)
  - Misconfigurations
  - Embedded secrets

**Configuration**:

```yaml
severity: "CRITICAL,HIGH"
exit-code: "1" # Fail on vulnerabilities
format: "sarif" # Security Alert Format
```

**Pipeline behavior**:

- ✅ **Pass**: No HIGH/CRITICAL vulnerabilities
- ❌ **Fail**: Any HIGH/CRITICAL vulnerabilities in images
- Uploads SARIF reports to GitHub Security tab
- Scans BOTH backend and frontend images

---

### 4. Code Quality & Security Analysis (SonarCloud)

**Tool**: SonarCloud (by SonarSource)

**What it does**:

- Comprehensive code quality analysis
- Security vulnerability detection (OWASP Top 10)
- Code smell identification
- Technical debt calculation
- Code coverage tracking
- Maintainability ratings

**Detection capabilities**:

- **Bugs**: Actual errors in code logic
- **Vulnerabilities**: Security issues (SQL injection, XSS, etc.)
- **Code Smells**: Maintainability issues
- **Security Hotspots**: Code requiring security review
- **Duplications**: Code duplication percentage
- **Coverage**: Test coverage metrics

**Configuration** (`sonar-project.properties`):

```properties
sonar.projectKey=Bogomil-Stoyanov_DevopsJokesApi
sonar.organization=bogomil-stoyanov
sonar.sources=backend/,frontend/src/
sonar.tests=backend/
sonar.javascript.lcov.reportPaths=backend/coverage/lcov.info
```

**Pipeline behavior**:

- ✅ **Pass**: Quality gate passed (customizable thresholds)
- ❌ **Fail**: Quality gate failed (critical issues found)
- Detailed reports available on [SonarCloud Dashboard](https://sonarcloud.io)
- Tracks metrics over time (trending)

**GitHub Action**: Uses `SonarSource/sonarqube-scan-action@a31c9398be7ace6bbfaf30c0bd5d415f843d45e9` (v7.0.0) with full commit SHA for security

---

## Required GitHub Secrets

Configure these secrets in **Settings → Secrets and variables → Actions**:

| Secret Name          | Description             | How to obtain                                               |
| -------------------- | ----------------------- | ----------------------------------------------------------- |
| `DOCKERHUB_USERNAME` | Docker Hub username     | Your Docker Hub account username                            |
| `DOCKERHUB_TOKEN`    | Docker Hub access token | Docker Hub → Account Settings → Security → New Access Token |
| `SONAR_TOKEN`        | SonarCloud access token | SonarCloud → My Account → Security → Generate Token         |

### Creating a Docker Hub Access Token:

1. Login to [Docker Hub](https://hub.docker.com/)
2. Navigate to **Account Settings → Security**
3. Click **New Access Token**
4. Name: `github-actions-pipeline`
5. Permissions: **Read, Write, Delete**
6. Copy the token (only shown once)
7. Add to GitHub repository secrets

### Creating a SonarCloud Token:

1. Login to [SonarCloud](https://sonarcloud.io)
2. Navigate to **My Account → Security**
3. Generate new token with name `github-actions`
4. Copy the token (only shown once)
5. Add to GitHub repository as `SONAR_TOKEN`
6. Import/configure your project in SonarCloud dashboard

---

## Pipeline Execution

### On Pull Requests

```
✅ CI & Testing
✅ Security Scanning (npm audit, CodeQL, SonarCloud)
✅ Build Docker Images
✅ Trivy Image Scanning
```

### On Push to main/master

```
✅ CI & Testing
✅ Security Scanning (npm audit, CodeQL, SonarCloud)
✅ Build Docker Images
✅ Trivy Image Scanning
✅ Delivery → Docker Hub
```

---

## Security Policy

### Vulnerability Handling

**HIGH/CRITICAL vulnerabilities = Build Failure**

When security scans fail:

1. **Review the security report**:

   - GitHub Actions → Failed workflow → Expand failed step
   - Or download artifact reports

2. **Assess the vulnerability**:

   - Is it in production code or devDependencies?
   - Is there a patch available?
   - What's the exploit risk?

3. **Remediate**:

   - Update dependencies: `npm update`
   - Apply patches: `npm audit fix`
   - If no fix exists, consider:
     - Alternative packages
     - Mitigation strategies
     - Risk acceptance (documented)

4. **Verify the fix**:

   ```bash
   npm audit --production --audit-level=high
   ```

5. **Re-run the pipeline**:
   - Commit the fixes
   - Push to trigger new run

---

## Continuous Delivery

### Image Versioning Strategy

Images are tagged with:

- **`latest`**: Always points to the most recent main/master build
- **`<git-sha>`**: Immutable tag for specific commit (e.g., `abc1234`)

**Why both?**

- `latest`: Easy for development/testing
- SHA tags: Production deployments (traceable, rollback-safe)

### Using Images from Docker Hub

```bash
# Pull the latest images
docker pull <your-dockerhub-username>/jokes-api-backend:latest
docker pull <your-dockerhub-username>/jokes-api-frontend:latest

# Or specific version
docker pull <your-dockerhub-username>/jokes-api-backend:abc1234567890
```

---

## Monitoring & Observability

### GitHub Security Features

1. **Code Scanning Alerts** (CodeQL results)

   - Navigate to: **Security → Code scanning**
   - Filter by severity
   - Assign and track fixes

2. **Dependabot Alerts** (complement to npm audit)

   - Enable in **Settings → Security → Dependabot alerts**
   - Automatic PR creation for updates

3. **Secret Scanning** (prevent credential leaks)
   - Enable in **Settings → Security → Secret scanning**

### Artifacts

Each workflow run stores:

- `dependency-audit-reports`: npm audit JSON files
- `backend-image`: Docker image
- `frontend-image`: Docker image

Download from **Actions → Workflow run → Artifacts**

---

## Performance Optimization

### Build Caching

The pipeline uses GitHub Actions cache for:

- **npm packages**: `cache: 'npm'`
- **Docker layers**: `cache-from: type=gha`

**Benefits**:

- Faster dependency installation
- Reduced build times (3-5x speedup)
- Lower CI costs

### Parallel Execution

Jobs run in parallel when possible:

```
test → [security-dependencies, security-codeql] → build → security-image-scan → deploy
```

Typical execution time:

- **PR**: ~4-5 minutes

---

## Local Testing

Test security scans locally before pushing:

```bash
# Dependency scanning
cd backend && npm audit --production --audit-level=high
cd frontend && npm audit --production --audit-level=high

# Build images
docker build -t jokes-api-backend:test ./backend
docker build -t jokes-api-frontend:test ./frontend

---

## Best Practices

1. **Never skip security scans** - They protect production
2. **Review alerts weekly** - Don't let them accumulate
3. **Use SHA tags in production** - Avoid `latest` for stability
4. **Pin base image versions** - `node:18-alpine3.19` instead of `node:18-alpine`
5. **Rotate Docker Hub tokens** - Every 90 days minimum
6. **Enable branch protection** - Require status checks to pass
7. **Monitor GitHub Security tab** - Set up notifications

---

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [npm audit Documentation](https://docs.npmjs.com/cli/v9/commands/npm-audit)
- [CodeQL Documentation](https://codeql.github.com/docs/)
- [Trivy Documentation](https://aquasecurity.github.io/trivy/)
- [Docker Security Best Practices](https://docs.docker.com/develop/security-best-practices/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

```
