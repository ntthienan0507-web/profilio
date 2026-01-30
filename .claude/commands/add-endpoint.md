# Add API Endpoint Command

Add a new API endpoint to an existing module following DataCentral API v4 patterns.

## Endpoint Request
$ARGUMENTS

## Implementation Steps

### Step 1: Identify Target Module
Find the appropriate module in `modules/` directory based on the resource domain.

### Step 2: Add SQLC Query (if needed)

Edit `db/queries/{entity}.sql`:
```sql
-- name: QueryName :one/:many/:exec/:execrows
SELECT columns FROM table
WHERE conditions
AND deleted_at IS NULL;
```

Run: `make sqlc`

### Step 3: Add Request/Response Types

Edit `modules/{module}/{module}.types.go`:
```go
// Request payload
type NewEndpointPayload struct {
    Field1 string `json:"field1" binding:"required"`
    Field2 int32  `json:"field2"`
}

// Response type (if custom)
type NewEndpointResponse struct {
    ID     int32  `json:"id"`
    Field1 string `json:"field1"`
}

// Query filters
type NewEndpointFilters struct {
    Status string `json:"status"`
    FromDate string `json:"from_date"`
}
```

### Step 4: Implement Controller Handler

Edit `modules/{module}/{module}.controllers.go`:
```go
func (c *Controller) NewEndpoint(ctx *gin.Context) {
    // 1. Get current user (if needed)
    currentUser, err := util.GetCurrentUser(ctx)
    if err != nil {
        types.InvalidLogic(ctx, "unauthorized")
        return
    }

    // 2. Parse path parameters
    idStr := ctx.Param("id")
    id, err := strconv.ParseInt(idStr, 10, 32)
    if err != nil {
        types.InvalidPayload(ctx, "invalid id")
        return
    }

    // 3. Bind request body (for POST/PUT)
    var payload NewEndpointPayload
    if err := ctx.ShouldBindJSON(&payload); err != nil {
        types.InvalidPayload(ctx, err.Error())
        return
    }

    // 4. Validate business logic
    if !isValidOperation(payload) {
        types.InvalidLogic(ctx, "operation not allowed")
        return
    }

    // 5. Execute database query
    result, err := c.db.QueryName(ctx, db.QueryNameParams{
        ID:     int32(id),
        Field1: payload.Field1,
    })
    if err != nil {
        if err == sql.ErrNoRows {
            types.NotFound(ctx, "resource not found")
            return
        }
        types.RaiseSQLError(ctx, err, "failed to execute query")
        return
    }

    // 6. Return response
    types.Success(ctx, result)
}
```

### Step 5: Register Route

Edit `modules/{module}/{module}.routes.go`:
```go
func (r *Routes) RegisterRoutes(rg *gin.RouterGroup) {
    router := rg.Group("/{resource}")
    {
        // Existing routes...

        // New endpoint
        router.POST("/:id/action",
            middlewares.VerifyAuthToken(),
            middlewares.RequirePermission(permissions.RESOURCE_NAME,
                []string{permissions.SCOPE_UPDATE}),
            r.controller.NewEndpoint)
    }
}
```

### Step 6: Add Permission (if new scope needed)

Edit `pkg/permissions/scopes.go`:
```go
const SCOPE_NEW_ACTION = "new_action"
```

## Endpoint Patterns by Type

### List with Pagination
```go
func (c *Controller) List(ctx *gin.Context) {
    var params types.PaginationParams
    if err := types.PerformSearchPaginationParams(ctx, &params); err != nil {
        types.InvalidPayload(ctx, err.Error())
        return
    }

    items, err := c.db.ListItems(ctx, db.ListItemsParams{
        Limit:  params.Limit,
        Offset: params.Offset,
    })
    // ...

    total, _ := c.db.CountItems(ctx)
    types.SuccessWithPagination(ctx, items, total, params)
}
```

### Get by ID
```go
func (c *Controller) GetByID(ctx *gin.Context) {
    id, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
    if err != nil {
        types.InvalidPayload(ctx, "invalid id")
        return
    }

    item, err := c.db.GetItemByID(ctx, int32(id))
    if err == sql.ErrNoRows {
        types.NotFound(ctx, "item not found")
        return
    }
    // ...
    types.Success(ctx, item)
}
```

### Create
```go
func (c *Controller) Create(ctx *gin.Context) {
    currentUser, _ := util.GetCurrentUser(ctx)

    var payload CreatePayload
    if err := ctx.ShouldBindJSON(&payload); err != nil {
        types.InvalidPayload(ctx, err.Error())
        return
    }

    item, err := c.db.CreateItem(ctx, db.CreateItemParams{
        Name:      payload.Name,
        CreatedBy: currentUser.EmployeeID,
    })
    // ...
    types.Created(ctx, item)
}
```

### Update
```go
func (c *Controller) Update(ctx *gin.Context) {
    currentUser, _ := util.GetCurrentUser(ctx)
    id, _ := strconv.ParseInt(ctx.Param("id"), 10, 32)

    var payload UpdatePayload
    if err := ctx.ShouldBindJSON(&payload); err != nil {
        types.InvalidPayload(ctx, err.Error())
        return
    }

    item, err := c.db.UpdateItem(ctx, db.UpdateItemParams{
        ID:        int32(id),
        Name:      payload.Name,
        UpdatedBy: currentUser.EmployeeID,
    })
    // ...
    types.Success(ctx, item)
}
```

### Delete (Soft)
```go
func (c *Controller) Delete(ctx *gin.Context) {
    id, _ := strconv.ParseInt(ctx.Param("id"), 10, 32)

    err := c.db.DeleteItem(ctx, int32(id))
    if err != nil {
        types.RaiseSQLError(ctx, err, "failed to delete")
        return
    }

    types.Success(ctx, gin.H{"message": "deleted successfully"})
}
```

### State Transition
```go
func (c *Controller) Approve(ctx *gin.Context) {
    currentUser, _ := util.GetCurrentUser(ctx)
    id, _ := strconv.ParseInt(ctx.Param("id"), 10, 32)

    // Check current state
    item, err := c.db.GetItemByID(ctx, int32(id))
    if item.Status != "pending" {
        types.InvalidLogic(ctx, "can only approve pending items")
        return
    }

    // Update state
    updated, err := c.db.UpdateItemStatus(ctx, db.UpdateItemStatusParams{
        ID:        int32(id),
        Status:    "approved",
        UpdatedBy: currentUser.EmployeeID,
    })
    // ...
    types.Success(ctx, updated)
}
```

## Checklist
- [ ] SQLC query added (if needed)
- [ ] Types defined with proper tags
- [ ] Controller handler implemented
- [ ] Route registered with proper middleware
- [ ] Permission scope added (if new)
- [ ] Error handling complete
- [ ] Run `make sqlc` (if queries added)
- [ ] Run `make lint`

## Instructions

1. Identify the target module
2. Check if database changes are needed
3. Follow the appropriate pattern above
4. Implement with proper error handling
5. Register route with correct permissions
6. Test the endpoint
