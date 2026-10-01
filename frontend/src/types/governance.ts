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

export interface RoleListItem {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  isSystem: boolean;
  _count?: { users: number };
}
