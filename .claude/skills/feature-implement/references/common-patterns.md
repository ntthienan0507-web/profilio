# Common Implementation Patterns

## Rejected/Cancelled Last Sorting

Always show rejected/cancelled items at the end of results.

```sql
ORDER BY
    CASE WHEN status IN ('rejected', 'cancelled') THEN 1 ELSE 0 END ASC,
    -- other sort fields after this
    {pk}_id DESC
```

## Employee IDs Filter with Security Intersection

When filtering by employee_ids, intersect with permission-allowed IDs.

```go
// Handle employee_ids filter with security
if len(filters.EmployeeIDs) > 0 {
    if len(employeeResourceIDs) > 0 {
        // Intersect filter with permission
        resourceSet := make(map[int32]bool)
        for _, id := range employeeResourceIDs {
            resourceSet[id] = true
        }
        var filtered []int32
        for _, id := range filters.EmployeeIDs {
            if resourceSet[id] {
                filtered = append(filtered, id)
            }
        }
        params.Column4 = filtered
    } else {
        params.Column4 = filters.EmployeeIDs
    }
} else {
    params.Column4 = employeeResourceIDs
}
```

## Empty Array Handling in SQL

Empty array `[]` should return all results, not zero results.

```sql
-- WRONG: empty array returns nothing
($1::INT[] IS NULL OR employee_id = ANY($1::INT[]))

-- CORRECT: empty array returns all
($1::INT[] IS NULL OR CARDINALITY($1::INT[]) = 0 OR employee_id = ANY($1::INT[]))
```

## Stats Query Pattern

Aggregate stats with same filters as list endpoint.

```sql
-- name: Get{Entity}Stats :one
SELECT
    COUNT(DISTINCT {pk}_id) AS total_requests,
    COUNT(DISTINCT CASE WHEN status = 'pending' THEN {pk}_id END) AS pending_count,
    COUNT(DISTINCT CASE WHEN status = 'approved' THEN {pk}_id END) AS approved_count,
    COUNT(DISTINCT CASE WHEN status = 'rejected' THEN {pk}_id END) AS rejected_count
FROM {table}
WHERE
    ($1::INT[] IS NULL OR CARDINALITY($1::INT[]) = 0 OR employee_id = ANY($1::INT[]))
    AND ($2::TEXT = '' OR status = $2);
```

## Sortable Config

```go
var {Entity}SortConfig = sortable.Config{
    AllowedFields: map[string]string{
        "{pk}_id":         "{table}.{pk}_id",
        "status":          "{table}.status",
        "employee_name":   "employees.employee_name",
        "department_name": "departments.department_name",
    },
    DefaultField: "{pk}_id",
    DefaultOrder: "desc",
}
```
