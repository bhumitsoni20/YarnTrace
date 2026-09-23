# YarnTrace Role-Based Access Control (RBAC) & Permissions

## 1. Overview

YarnTrace enforces a two-tier authorization system:
1. **Role-Based Access Control (RBAC)**: Broad functional classifications for system roles.
2. **Granular Permissions**: Action-level permissions that can be granted to roles or directly overridden on specific users.

---

## 2. Core System Roles

| Role Key | Name | Description |
|---|---|---|
| `ADMIN` | Administrator | Full unrestricted system access, user management, and audit inspection. |
| `STOCK_HEAD` | Stock / Warehouse Head | Responsible for yarn inward reception, lot registration, and stock issuance. |
| `PRODUCTION_HEAD` | Production Team Lead | Responsible for receiving yarn allocations, logging floor consumption, and tracking scrap/yield. |
| `QUALITY_HEAD` | Quality Assurance Lead | Inspects incoming yarn lots, tests tensile strength, and approves lots for production. |
| `DISPATCH_HEAD` | Dispatch / Logistics | Manages delivery slips, party dispatches, and final product movements. |
| `VIEWER` | Auditor / Viewer | Read-only access to reports and traceability timelines. |

---

## 3. Granular Permission Catalog

```typescript
export enum PermissionKey {
  // Inventory Permissions
  VIEW_INVENTORY = 'view_inventory',
  ADD_YARN = 'add_yarn',
  ISSUE_YARN = 'issue_yarn',
  UPDATE_STOCK = 'update_stock',
  TRANSFER_STOCK = 'transfer_stock',
  
  // Production Permissions
  MANAGE_PRODUCTION = 'manage_production',
  ALLOCATE_YARN = 'allocate_yarn',
  RECORD_CONSUMPTION = 'record_consumption',
  RECORD_YIELD = 'record_yield',
  
  // Commercial & Parties
  MANAGE_SUPPLIERS = 'manage_suppliers',
  MANAGE_PARTIES = 'manage_parties',
  MANAGE_PURCHASE_ORDERS = 'manage_purchase_orders',
  
  // Traceability & Reporting
  VIEW_TRACEABILITY = 'view_traceability',
  VIEW_REPORTS = 'view_reports',
  EXPORT_REPORTS = 'export_reports',
  
  // Administration
  MANAGE_USERS = 'manage_users',
  MANAGE_ROLES = 'manage_roles',
  VIEW_AUDIT_LOGS = 'view_audit_logs',
  EDIT_RECORDS = 'edit_records',
  DELETE_RECORDS = 'delete_records',
}
```

---

## 4. Backend Guard Usage

Permissions are enforced on NestJS controllers or handlers using the custom `@RequirePermission(...)` decorator:

```typescript
@Controller('inventory')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class InventoryController {
  
  @Get()
  @RequirePermission(PermissionKey.VIEW_INVENTORY)
  async getStockList() {
    // ...
  }

  @Post('issue')
  @RequirePermission(PermissionKey.ISSUE_YARN)
  async issueYarnToProduction(@Body() dto: IssueYarnDto) {
    // ...
  }
}
```

---

## 5. Frontend Permission Guarding

Frontend components inspect permissions via Redux selectors or custom hooks (`usePermission`):

```tsx
const { can } = usePermissions();

if (can('issue_yarn')) {
  return <Button onClick={openIssueModal}>Issue Yarn</Button>;
}
```
