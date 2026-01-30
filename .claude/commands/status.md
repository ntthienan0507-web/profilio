# Project Status

Show the current implementation status of DataCentral API v4.

## Steps

1. **Scan all plan files** from both locations:
   ```bash
   # Project plans
   ls -la .claude/plans/*.md 2>/dev/null | grep -v _index.md

   # Global plans (external reference)
   ls -la ~/.claude/plans/*.md 2>/dev/null
   ```

2. **For each plan file**, extract the frontmatter:
   - `status`: pending | in-progress | completed | on-hold
   - `priority`: high | medium | low
   - Count completed vs total tasks (checkboxes)

4. **Check project health**:
   ```bash
   go build ./...
   make db-migration-status 2>/dev/null || echo "Check migrations manually"
   ```

5. **Check module stats**:
   ```bash
   # Count modules
   ls -d modules/*/ | wc -l

   # Count total Go files
   find . -name "*.go" -type f | wc -l

   # Recently modified modules
   ls -lt modules/ | head -10
   ```

6. **Generate status report** using the module inventory below.

7. **Update `.claude/plans/_index.md`** with current counts.

---

## Module Inventory (40 modules)

### Core/Auth Domain
| Module | Files | Sub-modules | Description |
|--------|-------|-------------|-------------|
| account | 3 | - | Token verification, client management, JWKS |
| auth | 3 | - | User authentication, /me endpoint |
| employee | 5 | 4 | Employee CRUD, documents, avatar, regulations |

### Customer Domain (Complex)
| Module | Files | Sub-modules | Description |
|--------|-------|-------------|-------------|
| customer | 9+ | 8 | Customer management, CRM |
| - customer.contact | | | Contact information |
| - customer.credits | | | Customer credits |
| - customer.journey | | | Sales journey tracking |
| - customer.invoices | | | Customer invoices |
| - customer.mailers | | | Email campaigns |
| - customer.marketing | | | Marketing automation |
| - customer.service | | | Service assignments |
| - customer.logs | | | Activity logs |

### Contracts Domain (Complex)
| Module | Files | Sub-modules | Description |
|--------|-------|-------------|-------------|
| contracts | 31 | 7 | Contract management |
| - contracts.attachment | | | Contract files |
| - contracts.customer | | | Customer contracts |
| - contracts.negotiations | | | Negotiation tracking |
| - contracts.partners | | | Partner contracts |
| - contracts.samples | | | Contract templates |
| - contracts.subcontracts | | | Sub-contracts |
| - contracts.updates | | | Contract amendments |

### Service Domain (Complex)
| Module | Files | Sub-modules | Description |
|--------|-------|-------------|-------------|
| service | 18 | 9 | Service management |
| - service.analytics | | | Usage analytics |
| - service.configoptions | | | Configuration options |
| - service.configoptions.alerts | | | Config alerts |
| - service.dates | | | Service dates |
| - service.invoices | | | Service invoices |
| - service.metadata | | | Service metadata |
| - service.prices | | | Pricing |
| - service.technicals | | | Technical details |
| - service.updates | | | Service updates |

### Partner Portal (Very Complex)
| Module | Files | Sub-modules | Description |
|--------|-------|-------------|-------------|
| partner | 76 | 8+ | Partner/reseller portal |
| - partner.auth | | | Authentication (account, mfa, sso, password) |
| - partner.credits | | | Partner credits |
| - partner.ekyc | | | KYC verification |
| - partner.growth | | | Growth metrics |
| - partner.invoices | | | Partner invoices |
| - partner.orders | | | Order management |
| - partner.payment | | | Payment (braintree, momo, napas, paypal) |

### HR Domain
| Module | Files | Sub-modules | Description |
|--------|-------|-------------|-------------|
| dayoff | 6 | - | Day off requests/approvals |
| workdays | 5 | - | Workday management |
| holidays | 4 | - | Holiday calendar |
| coverletter | 5 | 1 | CV/Resume management |
| job | 4 | 1 | Job postings |

### Operations Domain
| Module | Files | Sub-modules | Description |
|--------|-------|-------------|-------------|
| tickets | 8 | 3 | Support tickets |
| - ticket.logs | | | Ticket history |
| - ticket.requests | | | Ticket requests |
| - tickets.internal | | | Internal tickets |
| oncall | 4 | 6 | On-call scheduling |
| - oncall.assignments | | | Shift assignments |
| - oncall.compensations | | | Compensation tracking |
| - oncall.logs | | | On-call logs |
| - oncall.schedules | | | Schedule management |
| - oncall.swaps | | | Shift swaps |
| sla | 1 | 3 | SLA management |
| - sla.downtime | | | Downtime tracking |
| - sla.services | | | Service SLAs |
| - sla.templates | | | SLA templates |
| survey | 6 | 1 | Customer surveys |

### Finance Domain
| Module | Files | Sub-modules | Description |
|--------|-------|-------------|-------------|
| invoice | 7 | 1 | Invoice management |
| businesses | 6 | - | Business expense requests |
| reports | 11 | - | Financial reports, analytics |

### Content/Documents
| Module | Files | Sub-modules | Description |
|--------|-------|-------------|-------------|
| documents | 5 | 2 | Document management |
| drive | 4 | - | File storage |
| upload | 3 | - | File uploads |

### Referral Domain (NEW)
| Module | Files | Sub-modules | Description |
|--------|-------|-------------|-------------|
| affiliate | 7 | - | Affiliate/referral system with promo codes |
| reseller | 3 | - | Reseller management |
| referrer | 3 | - | Referral tracking |

### Utility Modules
| Module | Files | Description |
|--------|-------|-------------|
| company | 5 | Company settings |
| dashboard | 3 | Dashboard widgets |
| department | 3 | Department management |
| position | 3 | Job positions |
| countries | 4 | Country data |
| notification | 4 | Notifications |
| product | 4 | Product catalog |
| vcard | 4 | vCard generation |
| referrer | 3 | Referral tracking |
| order | 3 | Order management |
| search | 4 | Global search |
| bot_tenders | 4 | Bot/automation |
| assistants | 2 | AI assistants |
| automation | 3 | Automation workflows (docs) |
| settings | 1 | App settings |
| shared | 1 | Shared utilities |

---

## Quick Stats

| Metric | Count |
|--------|-------|
| Total Modules | 40 |
| Complex Modules (5+ sub-modules) | 6 |
| Total Go Files | 424 |
| Domains | 10 |

---

## Plans (from .claude/plans/)

_Run `/status` to scan current plans_

---

## External Plans (from ~/.claude/plans/)

These are on-going plans stored in the global Claude plans directory.

### 1. Affiliate System Design ✅ Backend Complete
**File:** `~/.claude/plans/affiliate-system-design.md`
**Status:** Backend 95% | Frontend Pending
**Priority:** High

A comprehensive affiliate/referral system including:
- Affiliate management (linked to existing `referrers` table) ✅
- Promo codes system with validation ✅
- Click tracking and conversion attribution ✅
- Commission tiers and payout management ✅
- Partner Portal & Admin endpoints ✅

**Tables Created:** `affiliates`, `promos`, `promo_uses`, `affiliate_clicks`, `affiliate_payouts`, `affiliate_commissions`
**Files:** 7 Go files (2,740 lines) + Partner module (1,023 lines)
**Pending:** Frontend UI, TrackRevenue bug fix

### 2. Reseller Module Phase 1 ✅ Complete
**File:** `~/.claude/plans/floating-hatching-lamport.md`
**Status:** Phase 1 Complete | Phase 1.1-1.3 Pending
**Priority:** High

Reseller management extending the existing `referrers` module:
- Reseller CRUD (6 endpoints) ✅
- Junction table for reseller-customer relationships ✅
- Single reseller per organization constraint ✅
- Admin user management per reseller ⏳

**Tables Created:** `reseller_customers`, `reseller_admins`
**Files:** 3 Go files (661 lines)
**Pending:** Phase 1.1 frontend, Phase 1.2-1.3 backend

### 3. Oncall Improvements ✅ Complete
**Status:** Complete (Dec 23, 2025)

Recent improvements to oncall module:
- Pagination support for assignments list ✅
- Status and source filters ✅
- `created_by_name` field for visibility ✅
- Default date range updated ✅

---

### Quick Reference

| Plan | File | Backend | Frontend | Status |
|------|------|---------|----------|--------|
| Affiliate System | `affiliate-system-design.md` | 95% | 0% | Backend Complete |
| Reseller Module | `floating-hatching-lamport.md` | 60% | 40% | Phase 1 Complete |
| Oncall Improvements | N/A | 100% | 100% | Complete |

---

## Arguments

- `$ARGUMENTS`: Optional filter (e.g., "customer", "in-progress", plan name)

---

## Commands (7 total)

| Command | Purpose |
|---------|---------|
| `/status` | Project status + module inventory |
| `/architect {topic}` | Design modules, features, APIs |
| `/review-code {target}` | Review code + audit modules |
| `/implement {action}` | Create/manage/implement plans |
| `/add-endpoint {module}` | Add API endpoint |
| `/add-migration {name}` | Add database migration |
| `/debug {issue}` | Debug issues |

## Quick Examples

```bash
# Design a new feature
/architect reseller-module

# Review/audit a module
/review-code customer
/review-code changes

# Manage plans
/implement list
/implement new payment-gateway
/implement payment-gateway

# Add to existing module
/add-endpoint tickets
/add-migration add_reseller_table
```
