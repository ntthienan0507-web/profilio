# DATABASE.md Template

```markdown
# {Module} Database Structure

## Table: `{table_name}`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `{pk}_id` | `int4` | No | serial | Primary key |
| `{field}_name` | `varchar` | No | - | Name field |
| `{field}_status` | `varchar` | Yes | 'pending' | Status |
| `{fk}_id` | `int4` | Yes | null | FK → {related_table} |
| `created_at` | `timestamp` | Yes | now() | Created timestamp |
| `updated_at` | `timestamp` | Yes | now() | Updated timestamp |
| `deleted_at` | `timestamp` | Yes | null | Soft delete |

### Indexes

- Primary key on `{pk}_id`
- Index on `{fk}_id`
- Index on `status`

### Related Tables

| Table | Relationship | Description |
|-------|--------------|-------------|
| `employees` | Many-to-One | FK employee_id |
| `departments` | Many-to-One | Via employees |

---

## SQL Queries

### Get{Entity}s

List với pagination + filters.

\`\`\`sql
-- name: Get{Entity}s :many
SELECT t.*, e.employee_name, d.department_name
FROM {table} t
JOIN employees e ON e.employee_id = t.employee_id
JOIN departments d ON d.department_id = e.department_id
WHERE
    ($1::INT[] IS NULL OR CARDINALITY($1::INT[]) = 0 OR t.employee_id = ANY($1::INT[]))
    AND ($2::TEXT = '' OR t.status = $2)
ORDER BY
    CASE WHEN status IN ('rejected', 'cancelled') THEN 1 ELSE 0 END ASC,
    t.{pk}_id DESC
LIMIT $3 OFFSET $4;
\`\`\`

**Used by:** `GET /{module}`

### Get{Entity}Stats

Aggregate statistics.

\`\`\`sql
-- name: Get{Entity}Stats :one
SELECT
    COUNT(*) AS total_count,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending_count,
    COUNT(CASE WHEN status = 'approved' THEN 1 END) AS approved_count
FROM {table}
WHERE ($1::INT[] IS NULL OR CARDINALITY($1::INT[]) = 0 OR employee_id = ANY($1::INT[]));
\`\`\`

**Used by:** `GET /{module}/stats`

---

## Sortable Fields

| Field | DB Column |
|-------|-----------|
| `{pk}_id` | {table}.{pk}_id |
| `status` | {table}.status |
| `employee_name` | employees.employee_name |
| `department_name` | departments.department_name |
| `created_at` | {table}.created_at |

**Default:** `{pk}_id DESC`

---

## Enums / Status Values

| Value | Description |
|-------|-------------|
| `pending` | Chờ duyệt |
| `leader-approved` | Leader đã duyệt |
| `approved` | Đã duyệt |
| `rejected` | Từ chối |
| `cancelled` | Đã hủy |
```
