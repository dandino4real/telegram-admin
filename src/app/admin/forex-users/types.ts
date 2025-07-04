// Types for admin and user
export type AdminInfo = {
  name: string
  email: string
}

export type ForexUser = {
  _id: string;
  telegramId: string;
  username?: string;
  fullName?: string;
  botType: "forex";
  excoTraderLoginId?: string;
  email?: string;
  isApproved: boolean;
  isRejected: boolean;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  registeredVia?: "exco";
  approvedBy?: { name: string; email: string };
  rejectedBy?: { name: string; email: string };
};





// Types for dialog actions
export type DialogAction = {
  type: "approve" | "reject" | "delete"
  user: ForexUser
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
