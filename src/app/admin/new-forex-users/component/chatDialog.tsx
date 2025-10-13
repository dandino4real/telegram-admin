// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { format } from "date-fns";

// interface ChatMessage {
//   from: "user" | "admin";
//   text: string;
//   timestamp: string;
// }

// interface ChatDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   telegramId: string;
//   username: string;
//   adminId: string;
// }

// export function ChatDialog({
//   open,
//   onOpenChange,
//   telegramId,
//   username,
//   adminId,
// }: ChatDialogProps) {
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [input, setInput] = useState("");
//   const wsRef = useRef<WebSocket | null>(null);
//   const scrollRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!open) return;

//     const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";
//     const wsUrl = apiUrl.replace("http", "ws");
//     const ws = new WebSocket(`${wsUrl}/forex-chat?adminId=${adminId}`);

//     wsRef.current = ws;

//     ws.onopen = () => console.log("✅ Chat WebSocket connected");
//     ws.onclose = () => console.log("❌ Chat WebSocket closed");
//     ws.onerror = (err) => console.log("WebSocket error:", err);

//     ws.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       if (data.type === "user_message" && data.telegramId === telegramId) {
//         setMessages((prev) => [
//           ...prev,
//           { from: "user", text: data.text, timestamp: data.time },
//         ]);
//       }
//     };

//     return () => ws.close();
//   }, [open, telegramId, adminId]);

//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }
//   }, [messages]);

//   const sendMessage = () => {
//     if (!input.trim() || !wsRef.current) return;
//     const msg = input.trim();

//     wsRef.current.send(
//       JSON.stringify({
//         type: "admin_reply",
//         telegramId,
//         message: msg,
//       })
//     );

//     setMessages((prev) => [
//       ...prev,
//       { from: "admin", text: msg, timestamp: new Date().toISOString() },
//     ]);
//     setInput("");
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-lg">
//         <DialogHeader>
//           <DialogTitle>Chat with {username}</DialogTitle>
//         </DialogHeader>

//         {/* Chat Area */}
//         <div className="border rounded-md p-2 bg-muted/30">
//           <ScrollArea className="h-80">
//             <div ref={scrollRef} className="space-y-3 px-1 py-2">
//               {messages.length === 0 && (
//                 <p className="text-sm text-muted-foreground text-center mt-4">
//                   No messages yet
//                 </p>
//               )}

//               {messages.map((msg, i) => (
//                 <div
//                   key={i}
//                   className={`flex ${
//                     msg.from === "admin" ? "justify-end" : "justify-start"
//                   }`}
//                 >
//                   <div
//                     className={`relative px-3 py-2 rounded-2xl text-sm max-w-[75%] shadow-sm
//                       ${
//                         msg.from === "admin"
//                           ? "bg-blue-500 text-white rounded-br-none"
//                           : "bg-gray-200 text-gray-900 rounded-bl-none"
//                       }
//                     `}
//                   >
//                     <p>{msg.text}</p>
//                     <span
//                       className={`text-[10px] opacity-70 mt-1 block text-right ${
//                         msg.from === "admin" ? "text-white/80" : "text-gray-600"
//                       }`}
//                     >
//                       {format(new Date(msg.timestamp), "HH:mm")}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </ScrollArea>
//         </div>

//         {/* Input Area */}
//         <DialogFooter className="flex items-center gap-2 mt-3">
//           <Input
//             placeholder="Type a message..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           />
//           <Button onClick={sendMessage}>Send</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }








"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { useGetChatMessgesQuery } from "@/store/api"; // Adjust path to your api.ts file

interface ChatMessage {
  from: "user" | "admin";
  user: "Admin" | "User";
  text: string;
  timestamp: string;
}

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  telegramId: string;
  username: string;
  adminId: string;
}

export function ChatDialog({
  open,
  onOpenChange,
  telegramId,
  username,
  adminId,
}: ChatDialogProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, isFetching, refetch } = useGetChatMessgesQuery(
    { telegramId },
    { skip: !open }
  );

  // Refetch messages when dialog opens to ensure fresh data
  useEffect(() => {
    if (open) {
      setMessages([]); // Temporarily clear to show loading
      refetch();
    }
  }, [open, refetch]);

  // Set initial messages from fetched data
  useEffect(() => {
    if (data) {
      setMessages(
        data.messages.map((msg: { from: "user" | "admin"; text: string; timestamp: string }) => ({
          ...msg,
          user: msg.from === "admin" ? "Admin" : "User",
        }))
      );
    }
  }, [data]);

  // Connect WebSocket only after history is loaded (!isFetching && data exists)
  useEffect(() => {
    if (!open || !data || isFetching) {
      // Close WS if conditions not met
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";
    const wsUrl = apiUrl.replace("http", "ws");
    const ws = new WebSocket(`${wsUrl}/forex-chat?adminId=${adminId}`);

    wsRef.current = ws;

    ws.onopen = () => console.log("✅ Chat WebSocket connected");
    ws.onclose = () => console.log("❌ Chat WebSocket closed");
    ws.onerror = (err) => console.log("WebSocket error:", err);

    ws.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      if (parsedData.type === "user_message" && parsedData.telegramId === telegramId) {
        setMessages((prev) => [
          ...prev,
          { from: "user", user: "User", text: parsedData.text, timestamp: parsedData.time },
        ]);
      }
      // Optional: Handle admin_reply from other admins if backend broadcasts them
      // if (parsedData.type === "admin_reply" && parsedData.telegramId === telegramId) {
      //   setMessages((prev) => {
      //     // Avoid duplicate if last message matches (simple check)
      //     const lastMsg = prev[prev.length - 1];
      //     if (lastMsg?.from === "admin" && lastMsg.text === parsedData.text) {
      //       return prev;
      //     }
      //     return [...prev, { from: "admin", text: parsedData.text, timestamp: parsedData.time }];
      //   });
      // }
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [open, data, isFetching, telegramId, adminId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !wsRef.current) return;
    const msg = input.trim();
    const timestamp = new Date().toISOString();

    // Optimistically append admin message locally
    setMessages((prev) => [...prev, { from: "admin", user: "Admin", text: msg, timestamp }]);

    // Send to backend via WebSocket to persist and notify user
    wsRef.current.send(
      JSON.stringify({
        type: "admin_reply",
        telegramId,
        message: msg,
      })
    );

    setInput("");
  };

  const showLoading = isFetching && messages.length === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Chat with {username}</DialogTitle>
        </DialogHeader>

        {/* Chat Area */}
        <div className="border rounded-md p-2 bg-muted/30">
          <ScrollArea className="h-80">
            <div ref={scrollRef} className="space-y-3 px-1 py-2">
              {showLoading ? (
                <p className="text-sm text-muted-foreground text-center mt-4">
                  Loading messages...
                </p>
              ) : messages.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center mt-4">
                  No messages yet
                </p>
              ) : (
                messages.map((msg, i) => (
                  <div
                    key={`${msg.from}-${msg.timestamp}-${i}`} // Better key using timestamp
                    className={`flex ${
                      msg.user === "Admin" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`relative px-3 py-2 rounded-2xl text-sm max-w-[75%] shadow-sm
                        ${
                          msg.user === "Admin"
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-gray-200 text-gray-900 rounded-bl-none"
                        }
                      `}
                    >
                      <p>{msg.text}</p>
                      <span
                        className={`text-[10px] opacity-70 mt-1 block text-right ${
                          msg.user === "Admin" ? "text-white/80" : "text-gray-600"
                        }`}
                      >
                        {format(new Date(msg.timestamp), "HH:mm")}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Input Area */}
        <DialogFooter className="flex items-center gap-2 mt-3">
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button onClick={sendMessage} disabled={!wsRef.current}>
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}