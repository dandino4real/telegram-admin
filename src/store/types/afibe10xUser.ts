export interface Afibe10XUser {
    _id: string;
    telegramId: string;
    username?: string;
    fullName?: string;
    botType: "afibe10x";
    userId?: string; // WEEX UID
    status: "approved" | "pending" | "rejected";
    createdAt: string;
    approvedAt?: string;
    rejectedAt?: string;
    rejectionReason?: "no_deposit" | "wrong_link";
    approvedBy?: {
        name: string;
        email: string;
    };
    rejectedBy?: {
        name: string;
        email: string;
    };
    mode: "default" | "chat";
    messages?: {
        sender: "user" | "admin";
        user?: string;
        text: string;
        readByAdmin: boolean;
        timestamp: string;
    }[];
}
