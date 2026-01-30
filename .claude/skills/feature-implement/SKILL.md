---
name: feature-implement
description: Structured feature implementation workflow for Go modules. This skill should be used when implementing new features, adding endpoints, modifying existing modules, or creating new modules. Follows docs-first approach - check existing docs, create plan, implement, update docs. Ensures API.md and DATABASE.md stay in sync with code changes.
---

# Feature Implementation Workflow

Structured workflow for implementing features in Go modules with documentation sync.

## Workflow Phases

### Phase 1: Discovery
1. **Identify target module**: `modules/{name}/`
2. **Read existing docs**:
   - `modules/{name}/API.md` - Current API spec
   - `modules/{name}/DATABASE.md` - Current DB schema
3. **Read current code**: controllers, types, routes, SQL queries
4. **Gap analysis**: What exists vs what's needed

### Phase 2: Planning
1. **Create plan** in `plans/` directory with:
   - Feature requirements
   - Affected files list
   - SQL query changes
   - API endpoint changes
   - Breaking changes (if any)
2. **Get user approval** before implementation

### Phase 3: Implementation
Follow order: **SQL → Types → Controllers → Routes → Tests**

1. `db/queries/{table}.sql` - Add/modify queries
2. `make sqlc` - Generate Go code
3. `modules/{name}/{name}.types.go` - Add request/response types
4. `modules/{name}/{name}.controllers.go` - Add handlers
5. `modules/{name}/{name}.routes.go` - Register routes
6. `go vet ./modules/{name}/...` - Verify compilation

### Phase 4: Documentation Update
**MANDATORY** - Update docs to match implementation:

1. **API.md**: Endpoints, params, filters, responses
2. **DATABASE.md**: Schema, queries, indexes

### Phase 5: Review & Verify
**Before claiming complete:**

1. Run `go vet ./modules/{name}/...` - Verify compilation
2. Request code-reviewer subagent via Task tool
3. Fix Critical/Important issues before proceeding
4. Evidence before claims (see `code-review` skill)

See `references/` for templates and checklist.

## Quick Commands

```bash
# Check module structure
./scripts/check-module-structure.sh

# Generate SQLC
make sqlc

# Verify code
go vet ./modules/{name}/...
```

## References

- `references/implementation-checklist.md` - Step-by-step checklist
- `references/common-patterns.md` - Reusable code patterns
- `references/api-template.md` - API.md template
- `references/database-template.md` - DATABASE.md template
- `docs/module-structure-guide.md` - Full module structure guide
