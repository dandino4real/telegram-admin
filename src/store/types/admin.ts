// types/admin.ts

export type AdminRole = "admin" | "superadmin";
export type AdminStatus = "active" | "inactive" | "suspended";

export interface Admin {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: AdminRole;
  permissions: string[];
  status: AdminStatus;
  lastIp?: string;
  lastLogin?: string; // ISO date string
  createdAt: string;   // ISO date string
}
