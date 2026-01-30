#!/usr/bin/env python3
"""
Enhanced version - Generate detailed API.md and DATABASE.md for Go modules.

Usage:
    python generate-enhanced.py <module_path>

Examples:
    python generate-enhanced.py businesses
    python generate-enhanced.py customer/customer.invoices
"""

import os
import re
import sys
import json
from pathlib import Path
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Any

# Project root
PROJECT_ROOT = Path(__file__).resolve().parents[4]


@dataclass
class StructField:
    """Represents a field in a Go struct."""
    name: str
    go_type: str
    json_name: str
    is_required: bool = False
    validation_rules: List[str] = field(default_factory=list)
    description: str = ""


@dataclass
class TypeDefinition:
    """Represents a Go struct type."""
    name: str
    fields: List[StructField] = field(default_factory=list)
    description: str = ""


@dataclass
class Endpoint:
    method: str
    path: str
    handler: str
    permission: str = ""
    description: str = ""
    request_type: Optional[str] = None
    response_type: Optional[str] = None


@dataclass
class QueryParam:
    name: str
    type: str
    default: str = ""
    description: str = ""


@dataclass
class SQLQuery:
    name: str
    type: str  # :one, :many, :exec
    sql: str
    params: List[str] = field(default_factory=list)
    description: str = ""


@dataclass
class TableColumn:
    name: str
    type: str
    nullable: bool = True
    default: str = ""
    description: str = ""


@dataclass
class ModuleInfo:
    name: str
    path: str
    base_url: str = ""
    endpoints: List[Endpoint] = field(default_factory=list)
    query_params: List[QueryParam] = field(default_factory=list)
    filters: Dict[str, str] = field(default_factory=dict)
    sortable_fields: List[str] = field(default_factory=list)
    sql_queries: List[SQLQuery] = field(default_factory=list)
    table_columns: List[TableColumn] = field(default_factory=list)
    table_name: str = ""
    pk_field: str = ""
    type_definitions: Dict[str, TypeDefinition] = field(default_factory=dict)


def read_file(filepath: Path) -> str:
    """Read file content safely."""
    try:
        return filepath.read_text(encoding='utf-8')
    except Exception as e:
        print(f"Warning: Cannot read {filepath}: {e}")
        return ""


def extract_struct_fields(struct_body: str) -> List[StructField]:
    """Extract fields from a Go struct definition."""
    fields = []

    # Pattern: FieldName Type `json:"name" binding:"rules"`
    field_pattern = r'(\w+)\s+([^\s`]+)\s+`([^`]+)`'

    for match in re.finditer(field_pattern, struct_body):
        field_name = match.group(1)
        go_type = match.group(2)
        tags = match.group(3)

        # Parse JSON tag
        json_match = re.search(r'json:"([^"]+)"', tags)
        json_name = json_match.group(1).split(',')[0] if json_match else field_name.lower()

        # Parse binding tags
        is_required = False
        validation_rules = []

        binding_match = re.search(r'binding:"([^"]+)"', tags)
        if binding_match:
            rules = binding_match.group(1).split(',')
            if 'required' in rules:
                is_required = True
            validation_rules = [r for r in rules if r != 'required']

        # Parse validate tags
        validate_match = re.search(r'validate:"([^"]+)"', tags)
        if validate_match:
            validation_rules.extend(validate_match.group(1).split(','))

        fields.append(StructField(
            name=field_name,
            go_type=go_type,
            json_name=json_name,
            is_required=is_required,
            validation_rules=validation_rules
        ))

    return fields


def extract_type_definitions(content: str) -> Dict[str, TypeDefinition]:
    """Extract all type definitions from types.go."""
    type_defs = {}

    # Pattern: type Name struct { ... }
    type_pattern = r'type\s+(\w+)\s+struct\s*\{([^}]+)\}'

    for match in re.finditer(type_pattern, content, re.DOTALL):
        type_name = match.group(1)
        struct_body = match.group(2)

        fields = extract_struct_fields(struct_body)

        type_defs[type_name] = TypeDefinition(
            name=type_name,
            fields=fields
        )

    return type_defs


def infer_request_response_types(handler_name: str, method: str, type_defs: Dict[str, TypeDefinition]) -> tuple[Optional[str], Optional[str]]:
    """Infer request and response types from handler name."""
    request_type = None
    response_type = None

    # Common patterns for request types
    if method in ['POST', 'PUT', 'PATCH']:
        # Look for matching request type
        for type_name in type_defs.keys():
            if handler_name in type_name and 'Request' in type_name:
                request_type = type_name
                break
            if handler_name.replace('Create', '').replace('Update', '') in type_name and 'Request' in type_name:
                request_type = type_name
                break

    return request_type, response_type


def generate_example_json(type_def: TypeDefinition, indent: int = 2) -> str:
    """Generate example JSON from struct definition."""
    examples = {}

    for field in type_def.fields:
        # Generate example value based on type
        example_val = None

        if 'string' in field.go_type.lower():
            if 'email' in field.json_name:
                example_val = "user@example.com"
            elif 'name' in field.json_name:
                example_val = "John Doe"
            elif 'phone' in field.json_name:
                example_val = "+84123456789"
            elif 'url' in field.json_name or 'avatar' in field.json_name:
                example_val = "https://example.com/image.jpg"
            elif 'date' in field.json_name:
                example_val = "2026-01-21"
            else:
                example_val = "example_value"
        elif 'int' in field.go_type.lower():
            example_val = 1
        elif 'bool' in field.go_type.lower():
            example_val = True
        elif '[]' in field.go_type:
            if 'string' in field.go_type.lower():
                example_val = ["value1", "value2"]
            else:
                example_val = [1, 2]
        elif 'json.RawMessage' in field.go_type:
            example_val = {}
        else:
            example_val = None

        examples[field.json_name] = example_val

    return json.dumps(examples, indent=indent)


def extract_routes(content: str, module_name: str) -> tuple[List[Endpoint], str]:
    """Extract route definitions from routes.go."""
    endpoints = []

    # Find base path
    base_path_match = re.search(r'rg\.Group\s*\(\s*"([^"]+)"', content)
    base_path = base_path_match.group(1) if base_path_match else f"/{module_name}"

    # Find route groups
    group_pattern = r'(\w+)\s*:=\s*router\.Group\s*\(\s*"([^"]+)"'
    group_prefixes = {"router": ""}
    for match in re.finditer(group_pattern, content):
        var_name = match.group(1)
        prefix = match.group(2)
        group_prefixes[var_name] = prefix

    # Extract routes
    route_pattern = r'(\w+)\.(GET|POST|PUT|DELETE|PATCH)\s*\(\s*"([^"]*)"'

    for match in re.finditer(route_pattern, content):
        router_var = match.group(1)
        method = match.group(2)
        path = match.group(3)

        prefix = group_prefixes.get(router_var, "")
        full_path = base_path + prefix + path
        full_path = full_path.replace("//", "/")
        if full_path.endswith("/") and len(full_path) > 1:
            full_path = full_path[:-1]

        # Get route block
        line_start = match.start()
        paren_count = 0
        end_pos = match.end()
        for i, char in enumerate(content[match.end():], match.end()):
            if char == '(':
                paren_count += 1
            elif char == ')':
                if paren_count == 0:
                    end_pos = i + 1
                    break
                paren_count -= 1

        route_block = content[line_start:end_pos]

        # Extract handler
        handler_match = re.search(r'\.(\w+Controller|\w+)\.(\w+)', route_block)
        if handler_match:
            handler = handler_match.group(2)
        else:
            handler_match = re.search(r'controller\.(\w+)', route_block, re.IGNORECASE)
            handler = handler_match.group(1) if handler_match else ""

        # Extract permission
        perm_match = re.search(r'RequirePermission\s*\(\s*\w+\.(\w+)', route_block)
        if perm_match:
            resource = perm_match.group(1)
            scope_match = re.search(r'scopes\.(\w+)', route_block)
            scope = scope_match.group(1) if scope_match else "Index"
            permission = f"{resource}:{scope.lower()}"
        else:
            if "VerifyAuthToken" in route_block:
                permission = "Auth"
            else:
                permission = "Public"

        # Generate description from handler
        desc = re.sub(r'([a-z])([A-Z])', r'\1 \2', handler) if handler else ""

        endpoints.append(Endpoint(
            method=method,
            path=full_path,
            handler=handler,
            permission=permission,
            description=desc
        ))

    return endpoints, base_path


def extract_filters_from_types(content: str) -> Dict[str, str]:
    """Extract filter fields from types.go."""
    filters = {}

    filter_struct = re.search(r'type\s+\w*[Ff]ilters?\s+struct\s*\{([^}]+)\}', content)
    if filter_struct:
        struct_body = filter_struct.group(1)
        field_pattern = r'(\w+)\s+(\S+)\s+`json:"([^"]+)"'
        for match in re.finditer(field_pattern, struct_body):
            field_name = match.group(1)
            field_type = match.group(2)
            json_name = match.group(3).split(',')[0]
            filters[json_name] = field_type

    return filters


def extract_sortable_fields(content: str) -> List[str]:
    """Extract sortable fields from controllers.go."""
    sortable = set()

    case_pattern = r'case\s+"(\w+)":'
    for match in re.finditer(case_pattern, content):
        field = match.group(1)
        if not field.startswith("asc") and not field.startswith("desc"):
            if field not in ['pending', 'approved', 'rejected', 'cancelled', 'closed', 'followup']:
                sortable.add(field)

    map_pattern = r'"(\w+)":\s*"[^"]+"'
    for match in re.finditer(map_pattern, content):
        field = match.group(1)
        sortable.add(field)

    return list(sortable)


def extract_sql_queries(content: str) -> List[SQLQuery]:
    """Extract SQL queries from .sql file."""
    queries = []

    query_pattern = r'--\s*name:\s*(\w+)\s+(:one|:many|:exec|:execrows)'
    parts = re.split(r'(?=--\s*name:)', content)

    for part in parts:
        if not part.strip():
            continue

        name_match = re.search(query_pattern, part)
        if not name_match:
            continue

        name = name_match.group(1)
        query_type = name_match.group(2)

        sql_start = name_match.end()
        sql = part[sql_start:].strip()

        params = re.findall(r'\$(\d+)', sql)
        unique_params = sorted(set(int(p) for p in params))

        queries.append(SQLQuery(
            name=name,
            type=query_type,
            sql=sql.split(';')[0] + ';' if ';' in sql else sql,
            params=[f"${p}" for p in unique_params]
        ))

    return queries


def extract_table_info(sql_content: str) -> tuple[str, str, List[TableColumn]]:
    """Infer table structure from SQL queries."""
    table_name = ""
    pk_field = ""
    columns = []

    from_match = re.search(r'FROM\s+(\w+)', sql_content, re.IGNORECASE)
    if from_match:
        table_name = from_match.group(1)

    select_match = re.search(r'SELECT\s+(.*?)\s+FROM', sql_content, re.IGNORECASE | re.DOTALL)
    if select_match:
        fields_str = select_match.group(1)
        for field in re.findall(r'(\w+\.\w+|\w+)', fields_str):
            if '.' in field:
                col = field.split('.')[1]
            else:
                col = field
            if col not in ['*', 'AS', 'CASE', 'WHEN', 'THEN', 'END', 'COUNT', 'SUM']:
                if col.endswith('_id') and not pk_field:
                    pk_field = col
                columns.append(TableColumn(name=col, type="inferred"))

    return table_name, pk_field, columns


def generate_enhanced_api_md(info: ModuleInfo) -> str:
    """Generate enhanced API.md with detailed documentation."""
    lines = [
        f"# {info.name.replace('.', ' ').title()} API Documentation",
        "",
        f"Base URL: `/api/v1/{info.base_url}`",
        "",
        "## Endpoints Overview",
        "",
        "| Method | Endpoint | Description | Permission |",
        "|--------|----------|-------------|------------|",
    ]

    # Add endpoints table
    for ep in info.endpoints:
        lines.append(f"| `{ep.method}` | `{ep.path}` | {ep.description} | {ep.permission} |")

    lines.extend(["", "---", ""])

    # Detailed endpoint sections
    lines.append("## Endpoint Details")
    lines.append("")

    for ep in info.endpoints:
        lines.extend([
            f"### {ep.method} `{ep.path}`",
            "",
            f"**Handler:** `{ep.handler}`  ",
            f"**Permission:** `{ep.permission}`  ",
            f"**Description:** {ep.description}",
            ""
        ])

        # Request body for POST/PUT/PATCH
        if ep.method in ['POST', 'PUT', 'PATCH'] and ep.request_type and ep.request_type in info.type_definitions:
            type_def = info.type_definitions[ep.request_type]
            lines.extend([
                "**Request Body:**",
                "",
                "```json",
                generate_example_json(type_def),
                "```",
                "",
                "**Request Fields:**",
                "",
                "| Field | Type | Required | Validation | Description |",
                "|-------|------|----------|------------|-------------|"
            ])

            for field in type_def.fields:
                req = "✓" if field.is_required else ""
                rules = ", ".join(field.validation_rules) if field.validation_rules else "-"
                lines.append(f"| `{field.json_name}` | `{field.go_type}` | {req} | {rules} | {field.description or '-'} |")

            lines.append("")

        # Response format
        lines.extend([
            "**Response:**",
            "",
            "```json",
            "{",
            '  "message": "OK",',
        ])

        if 'Get' in ep.handler and ':id' not in ep.path and 'ByID' not in ep.handler:
            lines.extend([
                '  "pagination": {',
                '    "page": 1,',
                '    "page_size": 10,',
                '    "total": 100',
                '  },',
                '  "results": [...]'
            ])
        else:
            lines.append('  "data": {...}')

        lines.extend([
            "}",
            "```",
            "",
            "---",
            ""
        ])

    # Query parameters
    lines.extend([
        "## Query Parameters (GET endpoints)",
        "",
        "| Param | Type | Default | Description |",
        "|-------|------|---------|-------------|",
        "| `q` | string | - | Search query |",
        "| `page` | int | 1 | Page number |",
        "| `page_size` | int | 10 | Items per page |",
        "| `sort_by` | string | - | Sort field |",
        "| `sort_order` | string | desc | asc / desc |",
        "| `filters` | JSON | - | Filter object |",
        "",
    ])

    # Filters
    if info.filters:
        lines.extend([
            "## Available Filters",
            "",
            "| Filter | Type | Description |",
            "|--------|------|-------------|"
        ])

        for key, val in info.filters.items():
            lines.append(f"| `{key}` | `{val}` | Filter by {key.replace('_', ' ')} |")

        lines.extend(["", "**Example:**", "", "```json", "{"])
        filter_items = []
        for key, val in list(info.filters.items())[:3]:  # Show first 3 as example
            if '[]' in val:
                filter_items.append(f'  "{key}": [1, 2]')
            elif 'int' in val.lower():
                filter_items.append(f'  "{key}": 1')
            else:
                filter_items.append(f'  "{key}": "value"')
        lines.append(",\n".join(filter_items))
        lines.extend(["}", "```", ""])

    # Sortable fields
    if info.sortable_fields:
        lines.extend([
            "## Sortable Fields",
            "",
            "- " + "\n- ".join(f"`{f}`" for f in info.sortable_fields),
            "",
        ])

    # Error responses
    lines.extend([
        "---",
        "",
        "## Error Responses",
        "",
        "| Code | Message | Description |",
        "|------|---------|-------------|",
        "| 400 | Bad Request | Invalid request parameters |",
        "| 401 | Unauthorized | Missing or invalid authentication |",
        "| 403 | Forbidden | Insufficient permissions |",
        "| 404 | Not Found | Resource not found |",
        "| 500 | Internal Server Error | Server error |",
        "",
        "**Error Format:**",
        "",
        "```json",
        "{",
        '  "error_code": 400,',
        '  "error_message": "Bad Request",',
        '  "details": "Additional error information"',
        "}",
        "```",
        "",
        "---",
        "",
        "## Related Files",
        "",
        "| File | Description |",
        "|------|-------------|",
        f"| `{info.name.split('.')[-1]}.controllers.go` | HTTP handlers |",
        f"| `{info.name.split('.')[-1]}.routes.go` | Route definitions |",
        f"| `{info.name.split('.')[-1]}.types.go` | Request/Response types |",
        "| `DATABASE.md` | Database structure |",
    ])

    return "\n".join(lines)


def generate_database_md(info: ModuleInfo) -> str:
    """Generate DATABASE.md content."""
    table = info.table_name or info.name.replace('.', '_')
    pk = info.pk_field or f"{table.rstrip('s')}_id"

    lines = [
        f"# {info.name.replace('.', ' ').title()} Database Structure",
        "",
        f"## Table: `{table}`",
        "",
        "| Column | Type | Nullable | Default | Description |",
        "|--------|------|----------|---------|-------------|",
        f"| `{pk}` | `int4` | No | serial | Primary key |",
    ]

    seen = {pk}
    for col in info.table_columns:
        if col.name not in seen and col.name != '*':
            seen.add(col.name)
            col_type = "varchar" if "name" in col.name else "int4" if col.name.endswith("_id") else "timestamp" if "at" in col.name else "varchar"
            lines.append(f"| `{col.name}` | `{col_type}` | Yes | - | {col.name.replace('_', ' ').title()} |")

    lines.extend([
        "",
        "### Indexes",
        "",
        f"- Primary key on `{pk}`",
        "- Index on `deleted_at` (soft delete)",
        "",
        "---",
        "",
        "## SQL Queries",
        "",
    ])

    for query in info.sql_queries:
        lines.extend([
            f"### {query.name}",
            "",
            f"**Type:** `{query.type}`  ",
            f"**Parameters:** {', '.join(query.params) if query.params else 'None'}",
            "",
            "```sql",
            query.sql,
            "```",
            "",
        ])

    lines.extend([
        "---",
        "",
        "## Status / Enum Values",
        "",
        "| Value | Description |",
        "|-------|-------------|",
        "| `pending` | Pending approval |",
        "| `approved` | Approved |",
        "| `rejected` | Rejected |",
        "| `cancelled` | Cancelled |",
    ])

    return "\n".join(lines)


def find_sql_file(module_path: str) -> Optional[Path]:
    """Find SQL file for module."""
    queries_dir = PROJECT_ROOT / "db" / "queries"

    module_name = module_path.replace('/', '.').replace('\\', '.')
    last_part = module_name.split('.')[-1]

    snake_case = re.sub(r'([a-z])([A-Z])', r'\1_\2', last_part).lower()

    possible_names = [
        f"{module_name}.sql",
        f"{last_part}.sql",
        f"{module_name.replace('.', '_')}.sql",
        f"{module_path.split('/')[-1]}.sql",
        f"{snake_case}.sql",
    ]

    seen = set()
    for name in possible_names:
        if name not in seen:
            seen.add(name)
            sql_file = queries_dir / name
            if sql_file.exists():
                return sql_file

    return None


def generate_docs(module_path: str) -> tuple[bool, List[str], ModuleInfo]:
    """Generate enhanced documentation for a module."""
    modules_dir = PROJECT_ROOT / "modules"
    module_dir = modules_dir / module_path

    if not module_dir.exists():
        print(f"Error: Module directory not found: {module_dir}")
        sys.exit(1)

    module_name = module_path.split('/')[-1]

    print(f"\nGenerating enhanced docs for: {module_path}")
    print(f"Module directory: {module_dir}")

    info = ModuleInfo(
        name=module_name,
        path=module_path,
        base_url=module_path.replace('/', '/')
    )

    # Read types.go - MOST IMPORTANT for detailed docs
    types_file = module_dir / f"{module_name}.types.go"
    if types_file.exists():
        print(f"✓ Reading types: {types_file.name}")
        types_content = read_file(types_file)
        info.type_definitions = extract_type_definitions(types_content)
        info.filters = extract_filters_from_types(types_content)
        print(f"  Found {len(info.type_definitions)} type definitions")
        print(f"  Found {len(info.filters)} filter fields")

    # Read routes.go
    routes_file = module_dir / f"{module_name}.routes.go"
    if routes_file.exists():
        print(f"✓ Reading routes: {routes_file.name}")
        routes_content = read_file(routes_file)
        info.endpoints, detected_base = extract_routes(routes_content, module_name)
        if detected_base:
            info.base_url = detected_base.lstrip('/')

        # Infer request/response types for each endpoint
        for ep in info.endpoints:
            req_type, resp_type = infer_request_response_types(ep.handler, ep.method, info.type_definitions)
            ep.request_type = req_type
            ep.response_type = resp_type

        print(f"  Found {len(info.endpoints)} endpoints")
        print(f"  Base URL: /{info.base_url}")

    # Read controllers.go
    controllers_file = module_dir / f"{module_name}.controllers.go"
    if controllers_file.exists():
        print(f"✓ Reading controllers: {controllers_file.name}")
        controllers_content = read_file(controllers_file)
        info.sortable_fields = extract_sortable_fields(controllers_content)
        print(f"  Found {len(info.sortable_fields)} sortable fields")

    # Read SQL file
    sql_file = find_sql_file(module_path)
    if sql_file:
        print(f"✓ Reading SQL: {sql_file.name}")
        sql_content = read_file(sql_file)
        info.sql_queries = extract_sql_queries(sql_content)
        info.table_name, info.pk_field, info.table_columns = extract_table_info(sql_content)
        print(f"  Found {len(info.sql_queries)} SQL queries")
        print(f"  Table: {info.table_name}")
    else:
        print(f"⚠ No SQL file found")

    # Generate enhanced docs
    api_md = generate_enhanced_api_md(info)
    api_file = module_dir / "API.md"
    api_file.write_text(api_md, encoding='utf-8')
    print(f"\n✓ Generated: {api_file}")

    db_md = generate_database_md(info)
    db_file = module_dir / "DATABASE.md"
    db_file.write_text(db_md, encoding='utf-8')
    print(f"✓ Generated: {db_file}")

    return True, [], info


def main():
    if len(sys.argv) < 2:
        print("Usage: python generate-enhanced.py <module_path>")
        print("Example: python generate-enhanced.py employee")
        sys.exit(1)

    module_path = sys.argv[1].strip('/')

    try:
        validation_passed, warnings, info = generate_docs(module_path)

        print("\n" + "="*50)
        print("✅ Enhanced documentation generated successfully!")
        print("="*50)
        print(f"Endpoints: {len(info.endpoints)}")
        print(f"Type definitions: {len(info.type_definitions)}")
        print(f"SQL queries: {len(info.sql_queries)}")
        print("="*50)

    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
