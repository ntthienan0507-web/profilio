# Review Code

Review code, audit modules, and check pattern compliance.

## Arguments

- `$ARGUMENTS`: Module name, file path, or "changes" for git diff review

## Modes

| Input | Mode | Description |
|-------|------|-------------|
| `customer` | Module Audit | Full module review |
| `modules/customer/customer.controllers.go` | File Review | Single file review |
| `changes` | Git Diff | Review uncommitted changes |

## Steps

### 1. Identify Target

```bash
# For module
ls -la modules/{module_name}/
find modules/{module_name} -name "*.go" -type f

# For changes
git diff --name-only
git diff --stat
```

### 2. Check Structure (Module Mode)

**Expected Files:**
| File | Required | Purpose |
|------|----------|---------|
| `{module}.controllers.go` | Yes | HTTP handlers |
| `{module}.routes.go` | Yes | Route definitions |
| `{module}.types.go` | Yes | Request/response types |
| `{module}.helpers.go` | Optional | Business logic |

**Sub-modules:**
```bash
ls -d modules/{module}/*/ 2>/dev/null
```

### 3. Extract Information

**Routes** (read routes file):
- List all endpoints with methods
- Check middleware: `VerifyAuthToken()` -> `RequirePermission()`

**Queries:**
```bash
ls db/queries/ | grep -i {entity}
```

**Recent Changes:**
```bash
git log --oneline -5 -- modules/{module}/
```

### 4. Compliance Checklist

#### Architecture (20 pts)
- [ ] Controller struct with `ctx` and `db *db.Queries`
- [ ] Routes use proper middleware chain
- [ ] Types have proper binding/json tags
- [ ] Functions under 80 lines

#### Database (20 pts)
- [ ] SQLC queries exist for entity
- [ ] Queries filter `deleted_at IS NULL`
- [ ] Query naming: `-- name: Name :one/:many/:exec`

#### Error Handling (20 pts)
- [ ] `types.RaiseSQLError(ctx, err, "msg")` for DB errors
- [ ] `types.InvalidPayload(ctx, "msg")` for validation
- [ ] `types.InvalidLogic(ctx, "msg")` for business logic
- [ ] Early return pattern used

#### Security (20 pts)
- [ ] Auth middleware applied
- [ ] Permission scopes correct
- [ ] No sensitive data in responses
- [ ] Input validation present

#### Code Quality (20 pts)
- [ ] No deep nesting (use early returns)
- [ ] No duplicate code
- [ ] Proper naming conventions
- [ ] No magic numbers/strings

### 5. Lint Check (Optional)

```bash
golangci-lint run modules/{module}/...
```

## Output Format

```markdown
# Review: {target}

## Summary
| Metric | Value |
|--------|-------|
| Files | X |
| Endpoints | X |
| Queries | X |
| Compliance | X/100 |

## Structure
| File | Lines | Status |
|------|-------|--------|

## Endpoints
| Method | Path | Handler | Permission |
|--------|------|---------|------------|

## Findings

### Critical
- [ ] Issue - `file:line`

### Warnings
- [ ] Issue - `file:line`

### Suggestions
- [ ] Improvement - `file:line`

## Refactoring Opportunities

| Pattern | Location | Suggestion |
|---------|----------|------------|
| Long function | file:line | Extract helper |
| Deep nesting | file:line | Early returns |

## Next Steps
1. Fix critical issues
2. Address warnings
3. Consider suggestions
```

## Quick Examples

```bash
# Audit a module
/review-code customer

# Review specific file
/review-code modules/tickets/tickets.controllers.go

# Review uncommitted changes
/review-code changes
```
