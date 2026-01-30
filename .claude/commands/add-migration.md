# Add Database Migration Command

Create database migrations following DataCentral API v4 patterns with Goose.

## Migration Request
$ARGUMENTS

## Migration Types

### 1. Create New Table
```bash
make create-migration MIGRATION_NAME=create_table_name
```

Template:
```sql
-- +goose Up
CREATE TABLE IF NOT EXISTS table_name (
    -- Primary Key
    id SERIAL PRIMARY KEY,

    -- Foreign Keys (with naming convention)
    parent_id INTEGER REFERENCES parent_table(id) ON DELETE SET NULL,

    -- Core Fields
    code VARCHAR(50) UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',

    -- Numeric Fields
    amount NUMERIC(15, 2) DEFAULT 0,
    quantity INTEGER DEFAULT 0,

    -- Date Fields
    start_date DATE,
    end_date DATE,

    -- Boolean Fields
    is_active BOOLEAN DEFAULT TRUE,

    -- JSON Fields (for flexible metadata)
    metadata JSONB DEFAULT '{}',
    settings JSONB DEFAULT '{}',

    -- Audit Fields (REQUIRED for all tables)
    created_by INTEGER REFERENCES employees(id),
    updated_by INTEGER REFERENCES employees(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
);

-- Indexes (add based on query patterns)
CREATE INDEX idx_table_name_status ON table_name(status);
CREATE INDEX idx_table_name_parent ON table_name(parent_id);
CREATE INDEX idx_table_name_deleted ON table_name(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_table_name_created ON table_name(created_at DESC);

-- Unique constraints (if needed)
CREATE UNIQUE INDEX idx_table_name_code_unique ON table_name(code) WHERE deleted_at IS NULL;

-- Comments
COMMENT ON TABLE table_name IS 'Description of what this table stores';
COMMENT ON COLUMN table_name.status IS 'Status: pending, active, completed, cancelled';

-- +goose Down
DROP TABLE IF EXISTS table_name;
```

### 2. Add Columns
```bash
make create-migration MIGRATION_NAME=add_columns_to_table_name
```

Template:
```sql
-- +goose Up
ALTER TABLE table_name
    ADD COLUMN IF NOT EXISTS new_column VARCHAR(255),
    ADD COLUMN IF NOT EXISTS another_column INTEGER DEFAULT 0;

-- Add index if column will be queried frequently
CREATE INDEX IF NOT EXISTS idx_table_name_new_column ON table_name(new_column);

-- +goose Down
ALTER TABLE table_name
    DROP COLUMN IF EXISTS new_column,
    DROP COLUMN IF EXISTS another_column;

DROP INDEX IF EXISTS idx_table_name_new_column;
```

### 3. Modify Columns
```bash
make create-migration MIGRATION_NAME=modify_column_in_table_name
```

Template:
```sql
-- +goose Up
-- Change column type
ALTER TABLE table_name ALTER COLUMN column_name TYPE VARCHAR(500);

-- Change default value
ALTER TABLE table_name ALTER COLUMN column_name SET DEFAULT 'new_default';

-- Add/remove NOT NULL constraint
ALTER TABLE table_name ALTER COLUMN column_name SET NOT NULL;
ALTER TABLE table_name ALTER COLUMN column_name DROP NOT NULL;

-- Rename column
ALTER TABLE table_name RENAME COLUMN old_name TO new_name;

-- +goose Down
ALTER TABLE table_name ALTER COLUMN column_name TYPE VARCHAR(255);
ALTER TABLE table_name ALTER COLUMN column_name SET DEFAULT 'old_default';
```

### 4. Add Foreign Key
```bash
make create-migration MIGRATION_NAME=add_fk_table_to_parent
```

Template:
```sql
-- +goose Up
ALTER TABLE table_name
    ADD COLUMN IF NOT EXISTS parent_id INTEGER,
    ADD CONSTRAINT fk_table_parent
        FOREIGN KEY (parent_id)
        REFERENCES parent_table(id)
        ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_table_name_parent ON table_name(parent_id);

-- +goose Down
ALTER TABLE table_name DROP CONSTRAINT IF EXISTS fk_table_parent;
ALTER TABLE table_name DROP COLUMN IF EXISTS parent_id;
```

### 5. Create Index
```bash
make create-migration MIGRATION_NAME=add_index_to_table_name
```

Template:
```sql
-- +goose Up
-- Simple index
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_table_column ON table_name(column_name);

-- Composite index
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_table_multi ON table_name(col1, col2);

-- Partial index (more efficient for filtered queries)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_table_active
    ON table_name(status) WHERE deleted_at IS NULL;

-- GIN index for JSONB
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_table_metadata
    ON table_name USING GIN (metadata);

-- +goose Down
DROP INDEX CONCURRENTLY IF EXISTS idx_table_column;
DROP INDEX CONCURRENTLY IF EXISTS idx_table_multi;
DROP INDEX CONCURRENTLY IF EXISTS idx_table_active;
DROP INDEX CONCURRENTLY IF EXISTS idx_table_metadata;
```

### 6. Create Enum Type
```bash
make create-migration MIGRATION_NAME=create_enum_type_name
```

Template:
```sql
-- +goose Up
CREATE TYPE status_enum AS ENUM ('pending', 'active', 'completed', 'cancelled');

ALTER TABLE table_name
    ALTER COLUMN status TYPE status_enum USING status::status_enum;

-- +goose Down
ALTER TABLE table_name
    ALTER COLUMN status TYPE VARCHAR(50);

DROP TYPE IF EXISTS status_enum;
```

### 7. Data Migration
```bash
make create-migration MIGRATION_NAME=migrate_data_for_feature
```

Template:
```sql
-- +goose Up
-- Update existing data
UPDATE table_name
SET new_column =
    CASE
        WHEN old_column = 'value1' THEN 'new_value1'
        WHEN old_column = 'value2' THEN 'new_value2'
        ELSE 'default'
    END
WHERE new_column IS NULL;

-- Copy data from one table to another
INSERT INTO new_table (col1, col2, created_at)
SELECT old_col1, old_col2, NOW()
FROM old_table
WHERE condition;

-- +goose Down
-- Reverse the data changes if possible
UPDATE table_name SET new_column = NULL;
```

## SQLC Query Generation

After migration, add queries to `db/queries/{entity}.sql`:

```sql
-- name: GetEntityByID :one
SELECT * FROM entity WHERE id = $1 AND deleted_at IS NULL;

-- name: ListEntities :many
SELECT * FROM entity
WHERE deleted_at IS NULL
ORDER BY created_at DESC
LIMIT $1 OFFSET $2;

-- name: CreateEntity :one
INSERT INTO entity (name, status, created_by)
VALUES ($1, $2, $3)
RETURNING *;

-- name: UpdateEntity :one
UPDATE entity SET
    name = COALESCE(NULLIF($2, ''), name),
    status = COALESCE(NULLIF($3, ''), status),
    updated_by = $4,
    updated_at = NOW()
WHERE id = $1 AND deleted_at IS NULL
RETURNING *;

-- name: SoftDeleteEntity :exec
UPDATE entity SET deleted_at = NOW() WHERE id = $1;

-- name: CountEntities :one
SELECT COUNT(*) FROM entity WHERE deleted_at IS NULL;
```

Then run: `make sqlc`

## Commands Reference

```bash
# Create new migration
make create-migration MIGRATION_NAME=description

# Apply migrations
make db-migrate

# Rollback migrations
make db-rollback ROLLBACK_COUNT=1

# Check migration status
make db-migration-status

# Generate SQLC code
make sqlc

# Read table columns (helpful for queries)
make read-columns TABLE_NAME=table_name

# Generate INSERT query template
make create-insert-query TABLE_NAME=table_name OUTPUT=entity

# Generate UPDATE query template
make create-update-query TABLE_NAME=table_name OUTPUT=entity
```

## Checklist
- [ ] Migration file created with proper naming
- [ ] Both Up and Down migrations defined
- [ ] Appropriate indexes added
- [ ] Foreign keys have proper constraints
- [ ] Audit columns included (created_at, updated_at, deleted_at)
- [ ] SQLC queries written
- [ ] `make sqlc` executed
- [ ] Migration tested locally
- [ ] `make db-migrate` successful

## Instructions

1. Determine the type of migration needed
2. Create migration file using `make create-migration`
3. Write Up and Down SQL following templates
4. Add SQLC queries if new table/columns
5. Run `make sqlc` to generate Go code
6. Test migration with `make db-migrate`
7. Verify with `make db-migration-status`
