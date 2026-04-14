---
name: ship
description: Build, test, and open a pull request for the current branch
disable-model-invocation: true
allowed-tools: Bash(pnpm *) Bash(git *) Bash(gh *)
argument-hint: [PR title]
---

Ship the current branch as a pull request:

1. Run `pnpm test` — if tests fail, STOP and report the failures
2. Run `pnpm build` — if build fails, STOP and report the errors
3. Run `pnpm lint` if a lint script exists
4. Stage all changes: `git add -A`
5. Create a commit with a clear message summarizing the changes
6. Push the branch: `git push -u origin HEAD`
7. Create a PR with `gh pr create`:
   - Title: use $ARGUMENTS if provided, otherwise generate from commits
   - Body: 2-3 bullet summary, test plan, and link to any related issues
8. Print the PR URL
