---
name: generate-module-docs
invocation: user
description: Auto-generate API.md and DATABASE.md documentation for Go modules by analyzing code structure.
arguments: <module_path> - Path to module (e.g., "businesses" or "customer/customer.invoices")
---

# Generate Module Documentation

Automatically generates API.md and DATABASE.md by analyzing module code.

## Usage

```
/generate-module-docs <module_path>
```

**Examples:**
- `/generate-module-docs businesses`
- `/generate-module-docs customer/customer.invoices`
- `/generate-module-docs dayoff/dayoff.leaves`

## What It Does

1. **Reads module code:**
   - `modules/{path}/{name}.controllers.go` - Extract endpoints
   - `modules/{path}/{name}.types.go` - Extract request/response types
   - `modules/{path}/{name}.routes.go` - Extract route definitions

2. **Reads SQL queries:**
   - `db/queries/{table}.sql` - Extract SQL queries

3. **Generates documentation:**
   - `modules/{path}/API.md` - API endpoints, params, filters, responses
   - `modules/{path}/DATABASE.md` - Schema, queries, indexes

## Output Format

### API.md includes:
- Endpoints overview table
- Query parameters for each endpoint
- Filter options
- Sortable fields
- Response examples
- Permission requirements

### DATABASE.md includes:
- Table schema
- SQL queries with descriptions
- Indexes
- Related tables
- Enum/status values

## Workflow

```
┌─────────────────┐
│ Read Routes     │ → Extract endpoints, methods, permissions
└────────┬────────┘
         │
┌────────▼────────┐
│ Read Controllers│ → Extract handlers, filters, sorting
└────────┬────────┘
         │
┌────────▼────────┐
│ Read Types      │ → Extract request/response structs
└────────┬────────┘
         │
┌────────▼────────┐
│ Read SQL        │ → Extract queries, params
└────────┬────────┘
         │
┌────────▼────────┐
│ Generate Docs   │ → API.md + DATABASE.md
└─────────────────┘
```

## Notes

- Overwrites existing API.md/DATABASE.md if present
- Uses templates from `feature-implement/references/`
- Best run after implementing a module
