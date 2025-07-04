

export interface CryptoUser {
  _id: string;
  telegramId: string 
  username?: string;
  fullName?: string;
  botType: "crypto";
  country: string;
  bybitUid?: string;
  blofinUid?: string;
  isApproved: boolean;
  isRejected: boolean;
  status: "pending" | "approved" | "rejected";
  createdAt: string; // ISO date string (e.g., "2025-07-01T00:00:00.000Z")
  approvedAt?: string; // ISO date string
  rejectedAt?: string; // ISO date string
  registeredVia?: "bybit" | "blofin";
  approvedBy?: {
    name: string;
    email: string;
  };
  rejectedBy?: {
    name: string;
    email: string;
  };
}

// Types for dialog actions
export type DialogAction = {
  type: "approve" | "reject" | "delete"
  user: CryptoUser
}


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
