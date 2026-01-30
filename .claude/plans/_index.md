# DataCentral API v4 - Plans Index

> Last updated: 2025-12-23

## Status Overview

| Status | Count |
|--------|-------|
| In Progress | 1 |
| Completed | 2 |
| Pending | 0 |
| On Hold | 0 |

---

## Project Stats

| Metric | Count |
|--------|-------|
| Total Modules | 40 |
| Total Go Files | 835 |
| Complex Modules | 6 |
| Domains | 10 |

### Domains Summary

| Domain | Modules | Status |
|--------|---------|--------|
| Core/Auth | account, auth, employee | Stable |
| Customer | customer (8 sub-modules) | Stable |
| Contracts | contracts (7 sub-modules) | Stable |
| Service | service (9 sub-modules) | Stable |
| Partner | partner (9+ sub-modules) | Active |
| HR | dayoff, workdays, holidays, coverletter, job | Stable |
| Operations | tickets, oncall, sla, survey | Active |
| Finance | invoice, businesses, reports | Stable |
| Referral | affiliate, reseller, referrer | Active |
| Utility | 16 modules | Stable |

---

## Plans by Status

### Completed

| Plan | File | Description |
|------|------|-------------|
| Affiliate System (Backend) | `~/.claude/plans/affiliate-system-design.md` | Backend 95% complete, frontend pending |
| Reseller Module Phase 1 | `~/.claude/plans/floating-hatching-lamport.md` | Phase 1 complete, Phase 1.1-1.3 pending |

### In Progress

| Plan | File | Priority | Description |
|------|------|----------|-------------|
| Frontend Implementation | `~/.claude/plans/tender-enchanting-fox.md` | High | Affiliate & Reseller frontend UI |

### Pending
_No pending plans_

### On Hold
_No plans on hold_

---

## How to Add a Plan

1. Create a new plan file:
   ```
   /plan new {feature-name}
   ```

2. Plan file format:
   ```markdown
   ---
   status: pending
   priority: medium
   phase: 1
   created: 2024-12-20
   updated: 2024-12-20
   ---

   # Feature Name

   ## Overview
   ...

   ## Phases
   ### Phase 1: ...
   - [ ] Task 1
   - [ ] Task 2
   ```

3. Start implementation:
   ```
   /implement {feature-name}
   ```

4. Check status:
   ```
   /status
   ```
