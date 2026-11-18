---
title: "Mastering Git Push and Pull: Syncing Code and Resolving Conflicts"
description: "A complete guide to syncing local and remote repositories, tracking branches, understanding fetch vs pull, and resolving merge conflicts cleanly."
date: "2026-11-05"
author: "Kaushalendra Kumar"
ogImage: "/og/blog-git-push-pull.png"
tags: ["Git", "GitHub", "Collaboration", "DevOps"]
---

Commits let you record snapshots locally. But real-world software engineering happens across teams, CI/CD runners, and production servers.

`git push` and `git pull` are the commands that bridge your local working environment and remote repositories on GitHub. Here is how they operate under the hood, how to use them safely, and how to resolve merge conflicts when they arise.

---

## 1. Mental Model: Local Branches vs Remote Tracking Branches

When working with GitHub, you actually maintain three views of your branches:

1. **Local Branch (`main`):** Your private copy where your commits land.
2. **Remote-Tracking Branch (`origin/main`):** A cached bookmark of where the remote repository was the last time your machine communicated with GitHub.
3. **Remote Branch on GitHub:** The actual live branch on GitHub's servers.

```text
[ Local main ]  <--- (git pull) ---  [ origin/main cache ]  <--- (git fetch) ---  [ GitHub Server ]
       |                                                                                ^
       +---------------------------- (git push) ----------------------------------------+
```

---

## 2. Pushing Changes (`git push`)

`git push` sends your committed changes from your local repository up to GitHub.

### Setting Upstream Tracking (`-u`)

When pushing a branch for the very first time, tell Git where it should push and pull by default:

```bash
# Push the branch and associate it with the remote branch
git push -u origin main
```

The `-u` (or `--set-upstream`) flag links your local `main` to `origin/main`. After doing this once, future pushes on that branch require only:

```bash
git push
```

### Pushing a New Feature Branch

Standard Git workflow isolates work on separate branches before merging:

```bash
# Create and switch to a feature branch
git switch -c feature/user-profile

# Make changes, stage, and commit
git add .
git commit -m "feat(profile): display user bio and social links"

# Push the new branch to GitHub
git push -u origin feature/user-profile
```

Once pushed, GitHub displays a direct URL in your terminal to open a **Pull Request (PR)**.

---

## 3. Pulling Changes: `git fetch` vs `git pull`

A common source of confusion is the difference between `fetch` and `pull`.

### `git fetch` (Look Before You Leap)

`git fetch` contacts GitHub and downloads all recent commits, branches, and tags into your `origin/*` tracking cache **without modifying any of your active files**.

```bash
# Download latest changes from remote
git fetch origin

# Compare what the remote has that you don't
git log HEAD..origin/main --oneline
```

### `git pull` (Fetch + Merge)

`git pull` runs two operations under the hood: it runs `git fetch`, then immediately merges the remote branch into your current local branch:

```bash
# Fetches origin/main and merges it into your local branch
git pull
```

### Why Senior Devs Prefer `git pull --rebase`

By default, `git pull` can create unnecessary merge commits ("Merge branch 'main' of github.com..."). To maintain a linear, clean commit history:

```bash
# Pulls changes and reapplies your local commits on top of the remote changes
git pull --rebase origin main
```

To make rebase the global default:

```bash
git config --global pull.rebase true
```

---

## 4. How to Handle Merge Conflicts

A merge conflict happens when two developers modify the exact same lines of a file, or one person deleted a file another person modified. Git refuses to guess which version is correct and asks you to make the call.

### Step 1: Detect the Conflict

When you run `git pull` and a conflict occurs, Git outputs:

```text
CONFLICT (content): Merge conflict in src/config.ts
Automatic merge failed; fix conflicts and then commit the result.
```

### Step 2: Open the Conflicted File

In your editor or terminal, look for Git's conflict markers:

```typescript
<<<<<<< HEAD (Current Change - Your Local Code)
export const API_TIMEOUT = 5000;
=======
export const API_TIMEOUT = 8000;
>>>>>>> origin/main (Incoming Change - Remote Code)
```

- Content between `<<<<<<< HEAD` and `=======` is your local change.
- Content between `=======` and `>>>>>>> origin/main` is what was pushed to GitHub.

### Step 3: Resolve the Conflict

Edit the file manually to keep the desired behavior, and **delete all conflict markers**:

```typescript
export const API_TIMEOUT = 8000; // Resolved: Accepted remote timeout update
```

### Step 4: Stage and Finalize

Once the file is cleaned up, notify Git that the conflict is resolved:

```bash
# Stage the resolved file
git add src/config.ts

# Complete the merge (or continue rebase)
git commit -m "chore: resolve API timeout conflict with main"
# OR if you used rebase:
# git rebase --continue

# Push the synchronized code
git push origin main
```

---

## 5. Golden Rules for Syncing

1. **Pull Before You Work:** Run `git pull` at the start of your day to avoid falling behind the team.
2. **Small, Frequent Commits:** Smaller diffs mean fewer and simpler conflicts.
3. **Never Force Push to Main (`--force`):** Overwriting a shared branch destroys teammate commits. If you must update a rebased personal feature branch, use the safer flag:
   ```bash
   git push --force-with-lease
   ```

Following these habits keeps your codebase healthy, your history clean, and your team collaboration painless.
