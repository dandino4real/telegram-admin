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