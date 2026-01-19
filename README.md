# Lito
Lito is a music-focused social platform inspired by Letterboxd, where users can:
- Rate albums on a 0–10 scale
- Optionally rate individual tracks
- Follow friends and see their activity
- Discover new albums through recommendations and weekly releases

This repository contains the backend and supporting infrastructure for the Lito MVP.

## Git workflow (main + dev + feature branches)

### Branch roles
- **main**: production-only branch (what gets deployed). No direct commits.
- **dev**: integration branch (all feature work merges here first).
- **feature/***: short-lived branches for each task/issue.

### [COMPLETED] One-time setup (create dev branch)
```bash
git checkout main
git pull origin main
git checkout -b dev
git push -u origin dev--
```

# Starting Work on a Task

## 1) Sync local dev with remote
```bash
git checkout dev
git pull origin dev
```

## 2) Create a feature branch from dev
```bash
git checkout -b feature/<short-name>
```
### Example
- feature/fastapi-skeleton
- feature/auth-jwt
- feature/album-search

## 3) Check changes
```bash
git status
```

## 4) Stage and commit
```bash
git add .
git commit -m "Describe what you changed"
```

## 5) Push your feature branch
```bash
git push -u origin feature/<short-name>
```

# Merge into dev (via pull request)
### On GitHub:
    1) Open a Pull Request
    2) Base branch: dev
    3) Compare branch: feature/<short-name>
    4) In PR description, link issues like:
        - Closes #6

### After PR is merged:
Update local dev
```bash
git checkout dev
git pull origin dev
```

# Promote dev to main (release/deploy)
### PR from dev -> main On GitHub:
    1) Open a Pull Request
    2) Base branch: main
    3) Compare branch: dev
    4) Merge PR to deploy

# If you need to bring latest dev into feature branch
```bash
git checkout dev
git pull origin dev

git checkout feature/<short-name>
git merge dev
```
Resolve conflicts if needed then:
```bash
git push
```

# Delete a feature branch after merge (cleanup)
Delete remote:
```bash
git push origin --delete feature/<short-name>
```
Delete local:
```bash
git branch -d feature/<short-name>
```