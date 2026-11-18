---
title: "Mastering Git Commit: The Staging Area and Clean History"
description: "Understand the three trees of Git, how to use interactive staging, and how to write clear, production-grade commit messages using Conventional Commits."
date: "2026-11-05"
author: "Kaushalendra Kumar"
ogImage: "/og/blog-git-commit-guide.png"
tags: ["Git", "Best Practices", "Version Control", "Workflow"]
---

A Git commit is not just a backup button; it is a permanent snapshot of your project's history. When you or your teammates debug a regression six months later, your commit log is the documentation that tells the story of *why* changes were made.

Understanding how to control what goes into each commit is the foundation of clean engineering.

---

## 1. The Three Stages of Git

Before code lands in your commit history, it travels across three distinct zones:

```text
[ Working Directory ]  ---> (git add)  --->  [ Staging Area / Index ]  ---> (git commit)  --->  [ Repository (.git) ]
  Unsaved edits                               Ready to be recorded                               Permanent Snapshot
```

1. **Working Directory:** The actual files you are editing in your IDE.
2. **Staging Area (Index):** A holding pen where you prepare the exact files (or specific hunks of code) you want included in the next snapshot.
3. **Repository History:** Completed commits stored immutably in `.git`.

---

## 2. Inspecting Your Changes

Before staging anything, always inspect what actually changed. Never commit blindly.

```bash
# Check the status of modified, untracked, and staged files
git status

# Compact status view
git status -s

# See exact line diffs in your working directory (unstaged changes)
git diff

# See line diffs that are already staged
git diff --staged
```

---

## 3. Staging Changes (`git add`)

### Staging Specific Files vs Everything

```bash
# Stage a single file
git add src/auth/login.ts

# Stage multiple specific files
git add package.json package-lock.json

# Stage all tracked and untracked changes across the repo
git add .
```

### Pro Tip: Interactive Staging (`git add -p`)

If you edited one file to fix a bug, but also formatted whitespace or added temporary console logs, do not commit both together. Use patch mode:

```bash
git add -p src/auth/login.ts
```

Git will break your file into individual diff chunks ("hunks") and ask:
- `y`: Stage this hunk.
- `n`: Skip this hunk.
- `s`: Split the hunk into smaller pieces.
- `e`: Manually edit the hunk.

### Unstaging Files

Accidentally staged a file you didn't mean to commit? Remove it from the index without losing your file edits:

```bash
# Unstage a specific file
git restore --staged src/secret-config.json

# Discard unstaged modifications in a file (reverts to last commit)
git restore src/broken-experiment.ts
```

---

## 4. Crafting the Commit (`git commit`)

Once your staging area holds only the intended modifications, record the snapshot:

```bash
git commit -m "feat(auth): validate session token expiry before redirecting"
```

### Writing Multi-Line Commits

For complex changes, provide context. Running `git commit` without `-m` opens your default editor (`nano`, `vim`, or VS Code):

```text
feat(billing): support prorated charges for mid-cycle tier upgrades

- Calculate remainder of active billing cycle against daily rates
- Dispatch invoice.upcoming webhook to Stripe customer
- Add integration test suite for monthly-to-annual plan swaps

Closes #142
```

---

## 5. The Conventional Commits Standard

Using a standardized prefix makes your project history instantly readable and enables automated changelogs.

| Prefix | When to Use | Example |
| :--- | :--- | :--- |
| `feat:` | A new user-facing feature | `feat(search): add fuzzy matching for tag filters` |
| `fix:` | A bug fix | `fix(cart): prevent double charging on rapid button clicks` |
| `refactor:` | Code change that neither fixes a bug nor adds a feature | `refactor(db): extract connection pool to singleton helper` |
| `perf:` | A code change that improves performance | `perf(images): compress avatars on upload via libvips` |
| `docs:` | Documentation changes only | `docs(readme): add docker compose development instructions` |
| `test:` | Adding missing tests or correcting existing tests | `test(auth): add unit tests for JWT verification edge cases` |
| `chore:` | Build processes, tooling, or package updates | `chore(deps): bump next from 15.0.0 to 15.1.2` |

---

## 6. Fixing Your Last Commit (`--amend`)

Forgot to stage a typo fix or made a spelling mistake in your commit message? If you have **not pushed yet**, fix it in place:

```bash
# Stage the missing file
git add src/forgotten-file.ts

# Fold it into the previous commit and optionally update the message
git commit --amend -m "feat(auth): validate session token and handle expired cookies"
```

> **Warning:** Never amend a commit that has already been pushed to a shared remote branch, as this rewrites history for your teammates.
