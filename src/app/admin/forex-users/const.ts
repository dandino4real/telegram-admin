import { DialogAction } from "./types"

 export const getDialogContent = (pendingAction: DialogAction | null) => {
    if (!pendingAction) return null

    switch (pendingAction.type) {
      case "approve":
        return {
          title: "Approve User Request",
          description: `Are you sure you want to approve the crypto signal bot access for ${pendingAction.user.username}? This will grant them access to the trading signals.`,
          actionText: "Approve",
          actionClass: "bg-green-600 hover:bg-green-700",
        }
      case "reject":
        return {
          title: "Reject User Request",
          description: `Are you sure you want to reject the crypto signal bot access for ${pendingAction.user.username}? This will deny their access to the trading signals.`,
          actionText: "Reject",
          actionClass: "bg-red-600 hover:bg-red-700",
        }
      case "delete":
        return {
          title: "Delete User",
          description: `This action cannot be undone. This will permanently delete the user information for ${pendingAction.user.username}.`,
          actionText: "Delete",
          actionClass: "bg-red-600 hover:bg-red-700",
        }
      default:
        return null
    }
  }