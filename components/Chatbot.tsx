"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const newMessage: Message = { id: Date.now(), text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response from chatbot");
      }

      const result = await response.json();
      const botMessage: Message = {
        id: Date.now() + 1,
        text: result.response,
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (e: unknown) {
      let errorText = "An unknown error occurred.";
      if (e instanceof Error) {
        errorText = e.message;
      }
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: `Error: ${errorText}`,
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 sm:p-6 bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl">
      <h2 className="text-xl font-semibold mb-4 text-white">Ask about Bloom Forecast</h2>
      <div className="h-64 overflow-y-auto mb-4 p-2 border border-slate-700 rounded-lg bg-slate-900/50">
        {messages.length === 0 ? (
          <p className="text-slate-400 text-center mt-8">Start a conversation!</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 ${
                msg.sender === "user" ? "text-right text-emerald-300" : "text-left text-slate-300"
              }`}
            >
              <span
                className={`inline-block p-2 rounded-lg ${
                  msg.sender === "user" ? "bg-emerald-700/30" : "bg-slate-700/30"
                }`}
              >
                {msg.text}
              </span>
            </div>
          ))
        )}
        {loading && (
          <div className="text-left text-slate-400 mb-2">
            <span className="inline-block p-2 rounded-lg bg-slate-700/30 animate-pulse">
              Thinking...
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="flex space-x-2">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
          className="flex-1 bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:ring-emerald-500 focus:border-emerald-500"
          disabled={loading}
        />
        <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Send className="w-5 h-5" />
        </Button>
      </form>
    </Card>
  );
}
