---
name: review
description: Review the current PR or staged changes for issues
disable-model-invocation: true
allowed-tools: Read Grep Bash(git *)
---

## Current State
Git status: !`git status --short`
Staged diff: !`git diff --cached`
Unstaged diff: !`git diff`
Recent commits: !`git log --oneline -10`

## Instructions
Review the changes above. For each issue found, report:
- **File and line**: exact location
- **Severity**: bug / security / performance / style
- **Problem**: what's wrong and why
- **Fix**: specific code change to make

Focus on bugs and security issues first. Skip style nits unless they cause confusion.
Only report real issues — don't pad with "looks good" commentary.
