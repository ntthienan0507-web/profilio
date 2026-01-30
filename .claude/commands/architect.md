# Architect Mode

Design mode for planning modules, features, APIs, and integrations.

## Arguments

- `$ARGUMENTS`: Feature or topic to architect (e.g., "reseller-module", "payment-integration")

## Reference

- **Patterns**: See existing modules in `modules/` for patterns
- **Queries**: `db/queries/` for SQLC patterns
- **Permissions**: `pkg/permissions/` for scope definitions

## When to Use

- Designing new modules or features
- Planning database schema changes
- Designing API contracts
- Planning external integrations
- Migration strategies

## Steps

1. **Understand Requirements**
   - Clarify the problem being solved
   - Identify entities and operations needed
   - Define permission requirements

2. **Analyze Current System**
   - Review related modules: `ls modules/`
   - Check existing queries: `ls db/queries/`
   - Review similar implementations

3. **Design Solution**

   ### Database Schema
   ```sql
   CREATE TABLE {entity_name} (
       id SERIAL PRIMARY KEY,

       -- Foreign Keys
       {parent}_id INTEGER REFERENCES {parent}(id),

       -- Core Fields
       name VARCHAR(255) NOT NULL,
       status VARCHAR(50) DEFAULT 'pending',
       metadata JSONB DEFAULT '{}',

       -- Audit Fields (REQUIRED)
       created_by INTEGER REFERENCES employees(id),
       updated_by INTEGER REFERENCES employees(id),
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       deleted_at TIMESTAMP DEFAULT NULL
   );
   ```

   ### Module Structure
   ```
   modules/{module_name}/
   ├── {module}.controllers.go   # HTTP handlers
   ├── {module}.routes.go        # Route definitions
   ├── {module}.types.go         # Request/response types
   ├── {module}.helpers.go       # Business logic (optional)
   └── {sub_module}/             # Sub-modules (if complex)
   ```

   ### API Endpoints
   ```
   GET    /api/v1/{resources}           # List with pagination
   GET    /api/v1/{resources}/:id       # Get single
   POST   /api/v1/{resources}           # Create
   PUT    /api/v1/{resources}/:id       # Update
   DELETE /api/v1/{resources}/:id       # Soft delete
   POST   /api/v1/{resources}/:id/action # State transition
   ```

   ### Permission Matrix
   | Endpoint | Resource | Scope | Roles |
   |----------|----------|-------|-------|
   | GET /resources | resource | index | admin, manager |
   | POST /resources | resource | create | admin |

4. **External Integrations** (if needed)
   ```go
   // pkg/clients/{service}/
   type Client struct {
       baseURL    string
       httpClient *http.Client
   }
   ```

5. **Create Plan File**
   ```bash
   # Create plan at .claude/plans/{feature-name}.md
   ```

   Plan template:
   ```markdown
   ---
   status: pending
   priority: medium
   phase: 1
   created: {TODAY}
   updated: {TODAY}
   ---

   # {Feature Name}

   ## Overview
   {Brief description}

   ## Database Changes
   | Table | Change | Description |
   |-------|--------|-------------|

   ## API Endpoints
   | Method | Endpoint | Description |
   |--------|----------|-------------|

   ## Phases
   ### Phase 1: Core Implementation
   - [ ] Task 1
   - [ ] Task 2

   ### Phase 2: Extensions
   - [ ] Task 1
   ```

## Output Format

```markdown
# Architecture: {Feature Name}

## Overview
[Brief description]

## Database Schema
[Tables and relationships]

## Module Structure
[Files to create/modify]

## API Endpoints
[Endpoint definitions]

## Permission Matrix
[Roles and access]

## Dependencies
- Internal: [modules]
- External: [services]

## Implementation Phases
1. Phase 1: ...
2. Phase 2: ...

## Next Steps
- [ ] Create plan file: `/implement new {name}`
- [ ] Start implementation: `/implement {name}`
```
