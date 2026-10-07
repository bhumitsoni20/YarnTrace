import { UserRole } from './auth';

export interface SystemUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionItem {
  id: string;
  key: string;
  name: string;
  module: string;
  description?: string | null;
}

export interface RolePermissionEntry {
  id: string;
  roleId: string;
  permissionId: string;
  permission: PermissionItem;
}

export interface RoleListItem {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  isSystem: boolean;
  rolePermissions?: RolePermissionEntry[];
  _count?: { users: number };
  createdAt?: string;
  updatedAt?: string;
}
