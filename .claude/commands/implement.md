# Implement

Create, manage, and implement plans for DataCentral API v4.

## Arguments

- `$ARGUMENTS`: Action and plan name

## Actions

| Command | Description |
|---------|-------------|
| `/implement list` | List all plans |
| `/implement new {name}` | Create new plan |
| `/implement {name}` | Implement from plan |
| `/implement {name} phase-2` | Implement specific phase |

---

## List Plans

```bash
ls -la .claude/plans/*.md 2>/dev/null | grep -v _index.md
```

For each plan, show:
- Status (pending/in-progress/completed)
- Priority
- Progress (completed/total tasks)

---

## Create New Plan

1. Create `.claude/plans/{name}.md`:

```markdown
---
status: pending
priority: medium
phase: 1
created: {TODAY}
updated: {TODAY}
---

# {Plan Title}

## Overview
{Brief description}

## Goals
- Goal 1
- Goal 2

## Database Changes
| Table | Change | Description |
|-------|--------|-------------|

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|

## Phases

### Phase 1: {Title}
- [ ] Task 1
- [ ] Task 2

### Phase 2: {Title}
- [ ] Task 1
- [ ] Task 2

## Dependencies
- Internal: modules
- External: services

## Notes
- Implementation notes
```

---

## Implement from Plan

### Steps

1. **Read plan file**:
   ```
   .claude/plans/{plan-name}.md
   ```

2. **Identify current work**:
   - Find current phase from frontmatter
   - List uncompleted tasks (unchecked boxes)
   - Prioritize by dependency order

3. **For each task**, follow DataCentral patterns:

   **Database tasks:**
   ```bash
   make create-migration MIGRATION_NAME=...
   # Add queries to db/queries/{entity}.sql
   make sqlc
   ```

   **Module tasks:**
   - Controller: `modules/{module}/{module}.controllers.go`
   - Routes: `modules/{module}/{module}.routes.go`
   - Types: `modules/{module}/{module}.types.go`

   **Integration tasks:**
   - Client: `pkg/clients/{service}/`

4. **After completing each task**:
   - Mark checkbox: `- [x]`
   - Update `updated` date in frontmatter

5. **After completing phase**:
   - Increment `phase` in frontmatter
   - If all done, set `status: completed`

6. **Validate**:
   ```bash
   go build ./...
   make lint
   ```

---

## Task Rules

- Only mark `[x]` after code compiles
- Update plan immediately after each task
- If blocked, add note and move to next task

---

## Quick Examples

```bash
# List all plans
/implement list

# Create new plan
/implement new reseller-module

# Start implementing
/implement reseller-module

# Implement specific phase
/implement reseller-module phase-2
```
