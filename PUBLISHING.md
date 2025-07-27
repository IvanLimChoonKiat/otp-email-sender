# 📦 Publishing Guide

This guide will help you publish your OTP Email Sender package to npm and GitHub.

## 🛠️ Prerequisites

Before publishing, make sure you have:

1. **npm account**: [Sign up at npmjs.com](https://www.npmjs.com/signup)
2. **GitHub account**: [Sign up at github.com](https://github.com/join)
3. **Node.js installed**: Version 14 or higher
4. **Git installed**: For version control

## 📋 Pre-Publication Checklist

- [ ] Update `package.json` with your details:
  - [ ] Change `author` field
  - [ ] Update `repository` URL
  - [ ] Update `bugs` URL
  - [ ] Update `homepage` URL
- [ ] Update `README.md` with your GitHub username
- [ ] Test the package locally
- [ ] Choose a unique package name (check availability on npm)

## 🚀 Publishing to npm

### Step 1: Prepare Your Package

```bash
# 1. Update package.json with your information
# Edit: author, repository, bugs, homepage fields

# 2. Check if your package name is available
npm info otp-email-sender
# If it returns an error, the name is available
# If it shows package info, choose a different name

# 3. Test your package locally
npm test
npm run example
```

### Step 2: Login to npm

```bash
# Login to your npm account
npm login

# Verify you're logged in
npm whoami
```

### Step 3: Publish

```bash
# First time publishing
npm publish

# For scoped packages (recommended for unique naming)
npm publish --access public
```

### Step 4: Verify Publication

- Visit `https://npmjs.com/package/your-package-name`
- Test installation: `npm install your-package-name`

## 🐙 Publishing to GitHub

### Step 1: Create Repository

1. Go to [github.com/new](https://github.com/new)
2. Name your repository (e.g., `otp-email-sender`)
3. Choose public or private
4. Don't initialize with README (we already have one)

### Step 2: Push to GitHub

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial release: OTP Email Sender v1.0.0"

# Add remote origin (replace USERNAME with your GitHub username)
git remote add origin https://github.com/USERNAME/otp-email-sender.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Create a Release

1. Go to your repository on GitHub
2. Click "Releases" → "Create a new release"
3. Tag version: `v1.0.0`
4. Release title: `OTP Email Sender v1.0.0`
5. Describe the release features
6. Click "Publish release"

## 🏷️ Version Management

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** version: Breaking changes (2.0.0)
- **MINOR** version: New features, backward compatible (1.1.0)
- **PATCH** version: Bug fixes, backward compatible (1.0.1)

### Updating Versions

```bash
# Patch version (1.0.0 → 1.0.1)
npm version patch
npm publish

# Minor version (1.0.1 → 1.1.0)
npm version minor
npm publish

# Major version (1.1.0 → 2.0.0)
npm version major
npm publish

# Push tags to GitHub
git push --tags
```

## 🔐 Security & Best Practices

### npm Security

1. **Enable 2FA**: `npm profile enable-2fa`
2. **Use npm tokens**: For CI/CD pipelines
3. **Regular updates**: Keep dependencies updated

### GitHub Security

1. **Enable 2FA**: In GitHub security settings
2. **Branch protection**: Protect main branch
3. **Security advisories**: Enable Dependabot

## 🤖 Automated Publishing

### GitHub Actions Setup

The included `.github/workflows/ci.yml` provides:
- Automated testing on multiple Node.js versions
- Automatic npm publishing on releases

To use it:

1. Add npm token to GitHub secrets:
   - Go to GitHub repository → Settings → Secrets
   - Add `NPM_TOKEN` secret with your npm token
   - Get token from: `npm token create`

2. Create releases through GitHub UI or CLI

## 📊 Package Analytics

Monitor your package:

- **npm stats**: [npmjs.com/package/your-package](https://npmjs.com/package/)
- **GitHub insights**: Repository → Insights
- **Download stats**: [npm-stat.com](https://npm-stat.com/)

## 🛠️ Maintenance

### Regular Tasks

- [ ] Update dependencies monthly
- [ ] Review and respond to issues
- [ ] Update documentation
- [ ] Add new features based on feedback
- [ ] Monitor security advisories

### Community Engagement

- [ ] Respond to GitHub issues
- [ ] Review pull requests
- [ ] Update examples and documentation
- [ ] Share on social media/communities

## 📞 Support & Resources

- [npm documentation](https://docs.npmjs.com/)
- [GitHub documentation](https://docs.github.com/)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)

---

## 🎉 You're Ready!

Your OTP Email Sender package is now ready for the world! 

**Next steps:**
1. Update the package.json with your details
2. Test everything one more time
3. Publish to npm
4. Push to GitHub
5. Share with the community!

Good luck! 🚀
