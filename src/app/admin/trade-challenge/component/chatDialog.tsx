// "use client";

// import React, { useEffect, useRef, useState, useMemo } from "react";
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { format } from "date-fns";
// import { Afibe10XUser } from "@/store/types/afibe10xUser";

// interface ChatMessage {
//     sender: "user" | "admin";
//     user: "Admin" | "User";
//     text: string;
//     timestamp: string;
// }

// interface ChatDialogProps {
//     open: boolean;
//     onOpenChange: (open: boolean) => void;
//     user: Afibe10XUser | null;
//     adminId: string;
// }

// export function ChatDialog({
//     open,
//     onOpenChange,
//     user,
//     adminId,
// }: ChatDialogProps) {
//     const [wsMessages, setWsMessages] = useState<ChatMessage[]>([]);
//     const [input, setInput] = useState("");
//     const wsRef = useRef<WebSocket | null>(null);
//     const scrollRef = useRef<HTMLDivElement>(null);

//     const telegramId = user?.telegramId || "";
//     const username = user?.username || user?.fullName || "User";

//     // Reset WS messages when dialog opens/closes or user changes
//     useEffect(() => {
//         if (open) {
//             setWsMessages([]);
//         }
//     }, [open, telegramId]);

//     // Initial messages from user object
//     const historyMessages: ChatMessage[] = useMemo(() => {
//         if (!user || !user.messages) return [];
//         return user.messages.map((msg) => ({
//             sender: msg.sender,
//             user: msg.sender === "admin" ? "Admin" : "User",
//             text: msg.text,
//             timestamp: msg.timestamp,
//         }));
//     }, [user]);

//     const allMessages = useMemo(() => [...historyMessages, ...wsMessages], [historyMessages, wsMessages]);

//     // WebSocket Connection
//     useEffect(() => {
//         if (!open || !telegramId) {
//             if (wsRef.current) {
//                 wsRef.current.close();
//                 wsRef.current = null;
//             }
//             return;
//         }




//     const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";
//     const wsUrl = apiUrl.replace("http", "ws");
//     const ws = new WebSocket(`${wsUrl}/afibe10x-chat?adminId=${adminId}`);

//     wsRef.current = ws;


//         ws.onopen = () => {
//             console.log("Chat WebSocket connected");
//             // Optionally start chat mode
//             ws.send(JSON.stringify({ type: "start_chat", telegramId }));
//         };

//         ws.onclose = () => console.log("Chat WebSocket closed");
//         ws.onerror = (err) => console.log("WebSocket error:", err);

//         ws.onmessage = (event) => {
//             try {
//                 const parsedData = JSON.parse(event.data);
//                 if (parsedData.type === "user_message" && parsedData.telegramId === telegramId) {
//                     setWsMessages((prev) => [
//                         ...prev,
//                         { sender: "user", user: "User", text: parsedData.text, timestamp: parsedData.time },
//                     ]);
//                 }
//             } catch (e) {
//                 console.error("WS Message Parse Error", e);
//             }
//         };

//         return () => {
//             if (ws.readyState === WebSocket.OPEN) {
//                 // ws.send(JSON.stringify({ type: "end_chat", telegramId }));
//             }
//             ws.close();
//             wsRef.current = null;
//         };
//     }, [open, telegramId, adminId]);

//     // Auto-scroll
//     useEffect(() => {
//         if (scrollRef.current) {
//             scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//         }
//     }, [allMessages]);

//     // const sendMessage = () => {
//     //     if (!input.trim() || !wsRef.current) return;
//     //     const msg = input.trim();
//     //     const timestamp = new Date().toISOString();

//     //     // Optimistically append
//     //     setWsMessages((prev) => [...prev, { sender: "admin", user: "Admin", text: msg, timestamp }]);

//     //     wsRef.current.send(
//     //         JSON.stringify({
//     //             type: "admin_reply",
//     //             telegramId,
//     //             message: msg,
//     //         })
//     //     );

//     //     setInput("");
//     // };



//     const sendMessage = () => {
//     if (!input.trim() || !wsRef.current) return;

//     // Ensure socket is open
//     if (wsRef.current.readyState !== WebSocket.OPEN) {
//         console.error("WebSocket not open. Cannot send message.");
//         return;
//     }

//     const msg = input.trim();
//     const timestamp = new Date().toISOString();

//     // Optimistically append
//     setWsMessages((prev) => [...prev, { sender: "admin", user: "Admin", text: msg, timestamp }]);

//     wsRef.current.send(
//         JSON.stringify({
//             type: "admin_reply",
//             telegramId,
//             message: msg,
//         })
//     );

//     setInput("");
// };


//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent className="max-w-lg">
//                 <DialogHeader>
//                     <DialogTitle>Chat with {username}</DialogTitle>
//                 </DialogHeader>

//                 <div className="border rounded-md p-2 bg-muted/30">
//                     <ScrollArea className="h-80">
//                         <div ref={scrollRef} className="space-y-3 px-1 py-2">
//                             {allMessages.length === 0 ? (
//                                 <p className="text-sm text-muted-foreground text-center mt-4">
//                                     No messages yet
//                                 </p>
//                             ) : (
//                                 allMessages.map((msg, i) => (
//                                     <div
//                                         key={`${msg.timestamp}-${msg.sender}-${i}`}
//                                         className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"
//                                             }`}
//                                     >
//                                         <div
//                                             className={`relative px-3 py-2 rounded-2xl text-sm max-w-[75%] shadow-sm
//                         ${msg.sender === "admin"
//                                                     ? "bg-blue-500 text-white rounded-br-none"
//                                                     : "bg-gray-200 text-gray-900 rounded-bl-none"
//                                                 }
//                       `}
//                                         >
//                                             <p>{msg.text}</p>
//                                             <span
//                                                 className={`text-[10px] opacity-70 mt-1 block text-right ${msg.sender === "admin" ? "text-white/80" : "text-gray-600"
//                                                     }`}
//                                             >
//                                                 {format(new Date(msg.timestamp), "HH:mm")}
//                                             </span>
//                                         </div>
//                                     </div>
//                                 ))
//                             )}
//                         </div>
//                     </ScrollArea>
//                 </div>

//                 <DialogFooter className="flex items-center gap-2 mt-3">
//                     <Input
//                         placeholder="Type a message..."
//                         value={input}
//                         onChange={(e) => setInput(e.target.value)}
//                         onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//                     />
//                     <Button onClick={sendMessage} disabled={!wsRef.current}>
//                         Send
//                     </Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// }





"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
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
import { Afibe10XUser } from "@/store/types/afibe10xUser";

interface ChatMessage {
    sender: "user" | "admin";
    user: "Admin" | "User";
    text: string;
    timestamp: string;
}

interface ChatDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: Afibe10XUser | null;
    adminId: string;
}

export function ChatDialog({
    open,
    onOpenChange,
    user,
    adminId,
}: ChatDialogProps) {
    const [wsMessages, setWsMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [wsConnected, setWsConnected] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState("disconnected");
    const [retryCount, setRetryCount] = useState(0);
    const wsRef = useRef<WebSocket | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const heartbeatRef = useRef<NodeJS.Timeout | null>(null);

    const MAX_RETRIES = 3;
    const telegramId = user?.telegramId || "";
    const username = user?.username || user?.fullName || "User";

    // Reset messages when dialog opens/closes or user changes
    useEffect(() => {
        if (open) {
            setWsMessages([]);
            setRetryCount(0);
        }
    }, [open, telegramId]);

    // Initial messages from user object
    const historyMessages: ChatMessage[] = useMemo(() => {
        if (!user || !user.messages) return [];
        return user.messages.map((msg) => ({
            sender: msg.sender,
            user: msg.sender === "admin" ? "Admin" : "User",
            text: msg.text,
            timestamp: msg.timestamp,
        }));
    }, [user]);

    const allMessages = useMemo(() => [...historyMessages, ...wsMessages], [historyMessages, wsMessages]);

    // WebSocket connection with retry mechanism
    useEffect(() => {
        if (!open || !telegramId) {
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
            if (heartbeatRef.current) {
                clearInterval(heartbeatRef.current);
                heartbeatRef.current = null;
            }
            setWsConnected(false);
            setConnectionStatus("disconnected");
            return;
        }

        const connectWebSocket = () => {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
            // const isSecure = apiUrl.startsWith('https');
            // const wsProtocol = isSecure ? 'wss' : 'ws';
            // const baseUrl = apiUrl.replace(/^https?:\/\//, '');
            // const wsUrl = `${wsProtocol}://${baseUrl}/afibe10x-chat?adminId=${adminId}`;
            const wsUrl = apiUrl
                            .replace(/^http/, "ws")
                            .replace(/\/$/, "");
            
            
            // const ws = new WebSocket(wsUrl);
            const ws = new WebSocket(`${wsUrl}/afibe10x-chat?adminId=${encodeURIComponent(adminId)}`
);
           
            wsRef.current = ws;

            ws.onopen = () => {
                console.log("✅ Chat WebSocket connected");
                setWsConnected(true);
                setConnectionStatus("connected");
                setRetryCount(0);
                
                // Send start chat message
                ws.send(JSON.stringify({ 
                    type: "start_chat", 
                    telegramId,
                    timestamp: new Date().toISOString()
                }));
                
                // Start heartbeat
                heartbeatRef.current = setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ type: "ping" }));
                    }
                }, 25000);
            };

            ws.onmessage = (event) => {
                try {
                    const parsedData = JSON.parse(event.data);
                    console.log("📨 Received WebSocket message:", parsedData);
                    
                    switch (parsedData.type) {
                        case "connection_established":
                            console.log("✅ WebSocket connection confirmed by server");
                            break;
                        case "chat_started":
                            console.log("✅ Chat session started on server");
                            break;
                        case "user_message":
                            if (parsedData.telegramId === telegramId) {
                                setWsMessages((prev) => [
                                    ...prev,
                                    { 
                                        sender: "user", 
                                        user: "User", 
                                        text: parsedData.text, 
                                        timestamp: parsedData.time 
                                    },
                                ]);
                            }
                            break;
                        case "message_sent":
                            console.log("✅ Message delivered to server");
                            break;
                        case "pong":
                            // Heartbeat response - do nothing
                            break;
                        case "error":
                            console.log("❌ Server error:", parsedData.error);
                            break;
                        default:
                            console.log("Received unknown message type:", parsedData.type);
                    }
                } catch (e) {
                    console.log("❌ WS Message Parse Error", e);
                }
            };

            ws.onclose = (event) => {
                console.log("❌ WebSocket closed:", {
                    code: event.code,
                    reason: event.reason,
                    wasClean: event.wasClean
                });
                
                if (heartbeatRef.current) {
                    clearInterval(heartbeatRef.current);
                    heartbeatRef.current = null;
                }
                
                setWsConnected(false);
                setConnectionStatus(`disconnected (code: ${event.code})`);
                
                // Auto-reconnect logic
                if (retryCount < MAX_RETRIES && open) {
                    const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
                    console.log(`🔄 Will retry connection in ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);
                    
                    const timeoutId = setTimeout(() => {
                        setRetryCount(prev => prev + 1);
                    }, delay);
                    
                    return () => clearTimeout(timeoutId);
                }
            };

            ws.onerror = (err) => {
                console.log("❌ WebSocket error:", err);
                setConnectionStatus("error");
            };

            return () => {
                if (heartbeatRef.current) {
                    clearInterval(heartbeatRef.current);
                }
                if (ws.readyState === WebSocket.OPEN) {
                    ws.close();
                }
            };
        };

        const cleanup = connectWebSocket();
        return cleanup;
    }, [open, telegramId, adminId, retryCount]);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [allMessages]);

    // Send message
    const sendMessage = () => {
        if (!input.trim()) {
            console.log("❌ Message is empty");
            return;
        }
        
        if (!wsRef.current || !wsConnected) {
            console.log("❌ WebSocket not connected. Current state:", {
                wsRefExists: !!wsRef.current,
                wsConnected,
                readyState: wsRef.current?.readyState
            });
            return;
        }

        const msg = input.trim();
        const timestamp = new Date().toISOString();

        // Optimistic append
        setWsMessages((prev) => [...prev, { 
            sender: "admin", 
            user: "Admin", 
            text: msg, 
            timestamp 
        }]);

        try {
            wsRef.current.send(
                JSON.stringify({
                    type: "admin_reply",
                    telegramId,
                    message: msg,
                    timestamp: new Date().toISOString()
                })
            );
            console.log("📤 Message sent to WebSocket");
            setInput("");
        } catch (error) {
            console.log("❌ Failed to send message via WebSocket:", error);
            // Remove optimistic update on error
            setWsMessages((prev) => prev.slice(0, -1));
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex justify-between items-center">
                        <span>Chat with {username}</span>
                        <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded ${wsConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {wsConnected ? '🟢 Connected' : `🔴 ${connectionStatus}`}
                            </span>
                            {retryCount > 0 && (
                                <span className="text-xs text-gray-500">
                                    Retry: {retryCount}/{MAX_RETRIES}
                                </span>
                            )}
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="border rounded-md p-2 bg-muted/30">
                    <ScrollArea className="h-80">
                        <div ref={scrollRef} className="space-y-3 px-1 py-2">
                            {allMessages.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center mt-4">
                                    No messages yet
                                </p>
                            ) : (
                                allMessages.map((msg, i) => (
                                    <div
                                        key={`${msg.timestamp}-${msg.sender}-${i}`}
                                        className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`relative px-3 py-2 rounded-2xl text-sm max-w-[75%] shadow-sm
                                            ${msg.sender === "admin"
                                                    ? "bg-blue-500 text-white rounded-br-none"
                                                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                                                }`}
                                        >
                                            <p>{msg.text}</p>
                                            <span
                                                className={`text-[10px] opacity-70 mt-1 block text-right ${msg.sender === "admin" ? "text-white/80" : "text-gray-600"}`}
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

                <DialogFooter className="flex items-center gap-2 mt-3">
                    <Input
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        disabled={!wsConnected}
                    />
                    <Button 
                        onClick={sendMessage} 
                        disabled={!wsConnected || !input.trim()}
                    >
                        Send
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
