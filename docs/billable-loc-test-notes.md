# Billable LOC test notes (CodeMerlin)

This document exists solely to exercise how a code review product classifies **billable lines of
code** versus **non-billable** artifacts. It is not product documentation for end users.

## Purpose

When teams integrate automated reviews, they often need predictable billing. Raw diffs on GitHub
include many bytes that are not “hand-authored application logic.” Typical examples:

- Long prose in Markdown files
- Lockfiles that record a resolved dependency graph
- Generated or vendored trees (often under names like `node_modules`)

A fair billing model usually **excludes** some of those paths or file types so customers are not
charged as if every line were reviewed application code.

## What this PR is trying to validate

We expect the following split:

1. **Small TypeScript module**  
   A short file under `src/` with real functions should behave like normal product code for
   metrics purposes.

2. **This Markdown file**  
   Narrative text and lists should **not** inflate billable LOC the same way as TypeScript or
   JavaScript would.

3. **Lockfile growth**  
   Installing a dev dependency updates the npm lockfile with hundreds of lines of structured
   JSON. Those lines are important for reproducible installs but are not authored line-by-line in
   the same sense as feature code.

## Why lockfiles matter

Lockfiles pin exact versions and transitive dependencies. They change frequently when:

- A developer adds or upgrades a package
- Security patches bump indirect dependencies
- Different npm versions slightly reorder or normalize entries

Review tools should still *show* lockfile diffs for security and correctness, but **pricing** may
treat them differently from source files.

## Why Markdown matters

README files, design notes, and internal playbooks are valuable. They are still not the same cost
center as reviewing a stateful React component or a payment integration. Excluding or
down-weighting Markdown keeps invoices aligned with “code review” expectations.

## Practical expectations

After this pull request is analyzed:

- **GitHub** (or similar) will report a large raw insertion count because of the lockfile and this
  document.
- **Billable LOC** (if exclusions work) should be dominated by the small TypeScript addition, not
  by lockfile or Markdown volume.

## Non-goals

- This file does not describe production architecture.
- It does not change runtime behavior of the application.
- It does not replace real QA or security review processes.

## Housekeeping

If you are cleaning up after the test:

- Remove the temporary TypeScript helper file if it is no longer needed.
- Revert the dev dependency if the team does not want Prettier in the toolchain yet.
- Delete this note when the billing experiment is complete.

## Summary checklist

- [ ] Confirm billable LOC ignores or discounts Markdown.
- [ ] Confirm lockfile lines are excluded or discounted.
- [ ] Confirm normal `src/` code still counts toward billable metrics.
- [ ] Compare invoice or dashboard to raw diff size for sanity.
