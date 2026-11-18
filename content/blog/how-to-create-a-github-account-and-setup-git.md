---
title: "How to Create a GitHub Account and Configure Git Locally"
description: "A step-by-step guide to setting up your GitHub account, installing Git, configuring your identity, and authenticating securely via SSH."
date: "2026-10-01"
author: "Kaushalendra Kumar"
ogImage: "/og/blog-github-account-setup.png"
tags: ["Git", "GitHub", "Tools", "Setup"]
---

Setting up Git and GitHub correctly the first time spares you hours of authentication headaches, rejected pushes, and messy commit logs down the road.

Here is the exact setup process: from creating your GitHub account to configuring local credentials and passwordless SSH authentication.

---

## 1. Creating Your GitHub Account

1. Head to [github.com/signup](https://github.com/signup).
2. Enter your primary email address, choose a secure password, and select a **username**.
   > **Pro Tip:** Pick a professional, memorable username (e.g., `firstname-lastname` or your handle). It becomes your portfolio URL: `github.com/your-username`.
3. Complete the puzzle verification and enter the launch code sent to your inbox.
4. **Enable Two-Factor Authentication (2FA)** immediately:
   - Go to **Settings** > **Password and authentication** > **Two-factor authentication**.
   - Use an authenticator app (1Password, Bitwarden, or Google Authenticator) and save your recovery codes somewhere safe. GitHub requires 2FA for all active developers.

---

## 2. Installing Git on Your Machine

Check if Git is already installed by opening your terminal or command prompt:

```bash
git --version
```

If it is not installed, install it for your operating system:

- **Windows:** Download and install from [git-scm.com](https://git-scm.com/download/win) or run `winget install Git.Git`.
- **macOS:** Run `xcode-select --install` or use Homebrew: `brew install git`.
- **Linux (Ubuntu/Debian):** Run `sudo apt update && sudo apt install git -y`.

---

## 3. Configuring Your Git Identity

Git tags every commit with an author name and email. Run these commands once on your system:

```bash
# Set your display name
git config --global user.name "Your Name"

# Set the email matching your GitHub account
git config --global user.email "your.email@example.com"

# Set the modern default branch name to 'main'
git config --global init.defaultBranch main

# Handle line endings cleanly (Windows: true | macOS/Linux: input)
git config --global core.autocrlf true
```

Verify your configuration:

```bash
git config --list --show-origin
```

---

## 4. Setting Up SSH Key Authentication

GitHub no longer accepts account passwords when pushing or pulling over HTTPS. Setting up an **ED25519 SSH key** gives you secure, passwordless authentication.

### Step A: Generate the SSH Key

In your terminal, generate a new key pair (replace the email with your GitHub email):

```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
```

- When prompted for a file location, press **Enter** to accept the default (`~/.ssh/id_ed25519`).
- Enter a passphrase (recommended for security) or press **Enter** twice for no passphrase.

### Step B: Start the SSH Agent and Add Your Key

```bash
# Start SSH agent in the background
eval "$(ssh-agent -s)"

# Add your private key to the agent
ssh-add ~/.ssh/id_ed25519
```

### Step C: Add the Public Key to GitHub

Print your public key and copy the entire output:

```bash
cat ~/.ssh/id_ed25519.pub
```

1. On GitHub, navigate to **Settings** (top-right avatar) > **SSH and GPG keys**.
2. Click **New SSH key**.
3. Give it a descriptive title (e.g., `Workstation-ThinkPad` or `MacBook-Pro`).
4. Set **Key type** to `Authentication Key`.
5. Paste the copied key into the **Key** field and click **Add SSH key**.

### Step D: Test the Connection

Run this in your terminal:

```bash
ssh -T git@github.com
```

If everything is configured correctly, GitHub responds with:

```text
Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```

You are now fully set up to create repositories, stage commits, and push code without entering credentials every time.
