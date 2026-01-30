# Implementation Checklist

## Pre-Implementation

- [ ] Read `modules/{name}/API.md` (if exists)
- [ ] Read `modules/{name}/DATABASE.md` (if exists)
- [ ] Read `modules/{name}/{name}.controllers.go`
- [ ] Read `modules/{name}/{name}.types.go`
- [ ] Read `db/queries/{table}.sql`
- [ ] Identify all affected files

## Implementation Order

### 1. SQL Queries (`db/queries/{table}.sql`)

```sql
-- name: GetItems :many
SELECT * FROM items WHERE ...;

-- name: CreateItem :one
INSERT INTO items (...) VALUES (...) RETURNING *;
```

- [ ] Add new queries
- [ ] Run `make sqlc`

### 2. Types (`modules/{name}/{name}.types.go`)

```go
type Filters struct {
    Status      string  `json:"status"`
    EmployeeIDs []int32 `json:"employee_ids"`
}
```

- [ ] Add request/response types
- [ ] Add filter fields

### 3. Controllers (`modules/{name}/{name}.controllers.go`)

- [ ] Add handler functions
- [ ] Handle errors properly

### 4. Routes (`modules/{name}/{name}.routes.go`)

```go
router.GET("/endpoint",
    middlewares.VerifyAuthToken(),
    middlewares.RequirePermission(resources.X, []string{scopes.Y}),
    controller.Handler)
```

- [ ] Register routes
- [ ] Set permissions

### 5. Verification

- [ ] `go vet ./modules/{name}/...`

## Post-Implementation (MANDATORY)

### Update API.md
- [ ] Add endpoints to Overview table
- [ ] Document params, filters, responses

### Update DATABASE.md
- [ ] Add new columns/queries
- [ ] Update sortable fields

See `common-patterns.md` for reusable code patterns.
