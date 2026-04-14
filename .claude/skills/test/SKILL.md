---
name: test
description: Run the test suite and analyze any failures
disable-model-invocation: true
allowed-tools: Bash(pnpm test*) Read
---

Run the full test suite and analyze results:

1. Run `pnpm test -- --reporter=verbose` and capture the output
2. If ALL tests pass: report the count and say "All clear"
3. If any tests FAIL:
   - List each failing test name and file
   - Read the failing test file to understand what it expects
   - Read the source file being tested
   - Explain WHY each test is failing (root cause, not just the assertion message)
   - Suggest a specific fix for each failure
4. Do NOT fix anything automatically — just report
