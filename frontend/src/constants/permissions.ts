export const PERMISSIONS = {
  VIEW_INVENTORY: "view_inventory",
  ADD_YARN: "add_yarn",
  ISSUE_YARN: "issue_yarn",
  UPDATE_STOCK: "update_stock",
  MANAGE_PRODUCTION: "manage_production",
  RECORD_CONSUMPTION: "record_consumption",
  MANAGE_SUPPLIERS: "manage_suppliers",
  MANAGE_PARTIES: "manage_parties",
  MANAGE_PURCHASE_ORDERS: "manage_purchase_orders",
  VIEW_TRACEABILITY: "view_traceability",
  VIEW_REPORTS: "view_reports",
  MANAGE_USERS: "manage_users",
  MANAGE_ROLES: "manage_roles",
  VIEW_AUDIT_LOGS: "view_audit_logs",
  EDIT_RECORDS: "edit_records",
  DELETE_RECORDS: "delete_records",
} as const;

export type PermissionType = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
