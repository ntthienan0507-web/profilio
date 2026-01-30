# API.md Template

```markdown
# {Module} API Documentation

Base URL: `/api/v1/{module}`

## Endpoints Overview

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| `GET` | `/{module}` | List (paginated) | Auth |
| `GET` | `/{module}/stats` | Get statistics | {module}:index |
| `GET` | `/{module}/:id` | Get by ID | Auth |
| `POST` | `/{module}` | Create | {module}:create |
| `PUT` | `/{module}/:id` | Update | {module}:update |
| `DELETE` | `/{module}/:id` | Delete | {module}:delete |

---

## GET /{module}

### Query Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `q` | string | - | Search query |
| `page` | int | 1 | Page number |
| `page_size` | int | 10 | Items per page |
| `sort_by` | string | {pk}_id | Sort field |
| `sort_order` | string | desc | asc / desc |
| `filters` | JSON | - | Filter object |

### Filters

\`\`\`json
{"status": "active", "department_id": 5, "employee_ids": [1,2]}
\`\`\`

### Sortable Fields
- `{pk}_id` (default), `{field}_name`, `created_at`

### Response
\`\`\`json
{
  "pagination": {"page": 1, "page_size": 10, "total": 100},
  "message": "OK",
  "results": [...]
}
\`\`\`

---

## GET /{module}/stats

Stats với filters (no pagination).

### Response
\`\`\`json
{"message": "OK", "result": {"total": 100, "pending": 20, "approved": 80}}
\`\`\`

---

## Error Responses

| Code | Description |
|------|-------------|
| 400 | Bad Request |
| 422 | Validation Error |
| 500 | Server Error |

---

## Files

| File | Description |
|------|-------------|
| `{module}.controllers.go` | HTTP handlers |
| `{module}.routes.go` | Routes |
| `{module}.types.go` | Types |
| `DATABASE.md` | DB structure |
```
