# Versioning Guidelines

This project follows [Semantic Versioning](https://semver.org/) (SemVer) format: `MAJOR.MINOR.PATCH` (e.g., `2.0.0`)

## Version Bump Rules

### MAJOR Version (X.0.0) - Breaking Changes
Bump MAJOR version when:
- ✅ Breaking changes that require users to update their workflow
- ✅ Major API changes or removals
- ✅ Complete UI redesign
- ✅ Major architectural changes
- ✅ Significant milestone release

**Example**: `1.0.0` → `2.0.0`

---

### MINOR Version (0.X.0) - New Features
Bump MINOR version when:
- ✅ New features added (backward compatible)
- ✅ New event types supported
- ✅ New UI components or panels
- ✅ Enhanced functionality
- ✅ Significant feature additions

**Example**: `2.0.0` → `2.1.0`
**Example**: `2.1.0` → `2.2.0`

**Recent Examples:**
- Adding search functionality → MINOR bump
- Adding ImpressionSnapshot support → MINOR bump
- Adding new filters → MINOR bump

---

### PATCH Version (0.0.X) - Bug Fixes & Minor Updates
Bump PATCH version when:
- ✅ Bug fixes
- ✅ Minor UI improvements
- ✅ Performance optimizations
- ✅ Documentation updates
- ✅ Small enhancements
- ✅ Dependency updates

**Example**: `2.0.0` → `2.0.1`
**Example**: `2.0.1` → `2.0.2`

---

## Version Bump Checklist

When bumping version, update:

1. ✅ **manifest.json** - Update `version` field
2. ✅ **CHANGELOG.md** - Add new version entry at top
3. ✅ **README.md** - Update "Current Version" section
4. ✅ **Git commit** - Include version in commit message
5. ✅ **Git tag** - Create version tag (optional but recommended)

---

## Examples Based on Features

### Scenario 1: Adding Search Feature
**Change**: New global search functionality
**Version**: `2.0.0` → `2.1.0` (MINOR - new feature)

### Scenario 2: Fixing Search Bug
**Change**: Search highlighting bug fix
**Version**: `2.1.0` → `2.1.1` (PATCH - bug fix)

### Scenario 3: Adding New Event Type Support
**Change**: Support for new event type (e.g., checkout events)
**Version**: `2.1.1` → `2.2.0` (MINOR - new feature)

### Scenario 4: Major UI Redesign
**Change**: Complete panel redesign, breaking old layout
**Version**: `2.2.0` → `3.0.0` (MAJOR - breaking change)

### Scenario 5: Performance Optimization
**Change**: Faster event rendering, no feature changes
**Version**: `2.2.0` → `2.2.1` (PATCH - improvement)

---

## Quick Reference

| Change Type | Version Bump | Example |
|------------|--------------|---------|
| Breaking changes | MAJOR | `2.0.0` → `3.0.0` |
| New features | MINOR | `2.0.0` → `2.1.0` |
| Bug fixes | PATCH | `2.0.0` → `2.0.1` |
| UI improvements | PATCH | `2.0.0` → `2.0.1` |
| Performance | PATCH | `2.0.0` → `2.0.1` |
| Documentation | PATCH | `2.0.0` → `2.0.1` |

---

## Current Version

**Current**: `2.0.0`

**Last Updated**: November 2025

---

## Git Tagging (Recommended)

After version bump, create a git tag:

```bash
git tag -a v2.0.0 -m "Release version 2.0.0"
git push origin v2.0.0
```

---

## Memory Note

**IMPORTANT**: Always bump version based on feature type:
- **New Feature** = MINOR bump (2.0.0 → 2.1.0)
- **Bug Fix** = PATCH bump (2.0.0 → 2.0.1)
- **Breaking Change** = MAJOR bump (2.0.0 → 3.0.0)

**Always update**: manifest.json, CHANGELOG.md, README.md

