
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
import { useGetChatMessgesQuery } from "@/store/api";

interface ChatMessage {
  sender: "user" | "admin";
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
  // Remove local messages state for history; use query data directly
  const [wsMessages, setWsMessages] = useState<ChatMessage[]>([]); // Only for real-time WS appends
  const [input, setInput] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, isFetching, refetch } = useGetChatMessgesQuery(
    { telegramId },
    { 
      skip: !open,
      refetchOnMountOrArgChange: true, // Ensure fresh data on open
    }
  );

  // Refetch on open (no clear needed)
  useEffect(() => {
    if (open) {
      setWsMessages([]); // Clear only WS appends
      refetch();
    }
  }, [open, refetch]);

  // Transform query data to messages (memoize if large)
  const historyMessages: ChatMessage[] = React.useMemo(() => {
    if (!data) return [];
    return data.messages.map((msg: { sender: "user" | "admin"; text: string; timestamp: string }) => ({
      ...msg,
      user: msg.sender === "admin" ? "Admin" : "User",
    }));
  }, [data]);

  // Combine history + WS messages (dedupe if needed by timestamp)
  const allMessages = React.useMemo(
    () => [...historyMessages, ...wsMessages],
    [historyMessages, wsMessages]
  );

  // WebSocket Effect (unchanged, but depends on open only – history is separate)
  useEffect(() => {
    if (!open) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
    const wsUrl = apiUrl.replace("http", "ws");
    const ws = new WebSocket(`${wsUrl}/forex-chat?adminId=${adminId}`);

    wsRef.current = ws;

    ws.onopen = () => console.log("Chat WebSocket connected");
    ws.onclose = () => console.log("Chat WebSocket closed");
    ws.onerror = (err) => console.log("WebSocket error:", err);

    ws.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      if (parsedData.type === "user_message" && parsedData.telegramId === telegramId) {
        setWsMessages((prev) => [
          ...prev,
          { sender: "user", user: "User", text: parsedData.text, timestamp: parsedData.time },
        ]);
      }
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [open, telegramId, adminId]); // Remove data/isFetching dep – connect immediately on open

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [allMessages]);

  const sendMessage = () => {
    if (!input.trim() || !wsRef.current) return;
    const msg = input.trim();
    const timestamp = new Date().toISOString();

    // Optimistically append to WS state
    setWsMessages((prev) => [...prev, { sender: "admin", user: "Admin", text: msg, timestamp }]);

    wsRef.current.send(
      JSON.stringify({
        type: "admin_reply",
        telegramId,
        message: msg,
      })
    );

    setInput("");
  };

  const showLoading = isFetching && historyMessages.length === 0;
  const noMessages = !showLoading && allMessages.length === 0;

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
              ) : noMessages ? (
                <p className="text-sm text-muted-foreground text-center mt-4">
                  No messages yet
                </p>
              ) : (
                allMessages.map((msg, i) => (
                  <div
                    key={`${msg.timestamp}-${msg.sender}-${i}`} // Use timestamp + index for uniqueness
                    className={`flex ${
                      msg.sender === "admin" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`relative px-3 py-2 rounded-2xl text-sm max-w-[75%] shadow-sm
                        ${
                          msg.sender === "admin"
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-gray-200 text-gray-900 rounded-bl-none"
                        }
                      `}
                    >
                      <p>{msg.text}</p>
                      <span
                        className={`text-[10px] opacity-70 mt-1 block text-right ${
                          msg.sender === "admin" ? "text-white/80" : "text-gray-600"
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