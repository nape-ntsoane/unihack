"use client";

import { useState, useRef, useEffect, use } from "react";
import { Layout } from "@/components/Layout";
import Link from "next/link";
import type { ChatMessage } from "@/types";

const SUGGESTED_MESSAGES = [
  "I'm feeling a bit overwhelmed today",
  "How can I better manage my focus?",
  "I've practiced my deep breathing",
  "I'd like to book our next session"
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    senderId: "dr-amy",
    text: "Hello! How are you feeling today?",
    timestamp: new Date().toISOString()
  }
];

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mock loading initial history
    setMessages(INITIAL_MESSAGES);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: "user",
      text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");

    // Mock therapist reply
    setIsTyping(true);
    setTimeout(() => {
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: id,
        text: "Thank you for sharing that with me. Let's explore it together.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, reply]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <Layout>
      <div className="flex flex-col h-full max-w-lg mx-auto overflow-hidden">
        {/* Chat Header */}
        <header className="flex items-center justify-between py-6 px-2 border-b border-gray-100/50">
          <Link 
            href="/sessions"
            className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"
          >
            ←
          </Link>
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-gray-800">Support Chat</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Now</span>
            </div>
          </div>
          <div className="h-10 w-10 flex items-center justify-center text-xl">
            👩‍⚕️
          </div>
        </header>

        {/* Messages Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto scrollbar-none py-8 space-y-6 px-2"
        >
          {messages.map((msg) => {
            const isMe = msg.senderId === "user";
            return (
              <div 
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"} animate-label-up`}
              >
                <div className={`max-w-[85%] px-5 py-4 text-sm font-medium leading-relaxed ${
                  isMe 
                    ? "bg-gray-900 text-white rounded-[32px] rounded-br-lg" 
                    : "bg-white border border-gray-100 text-gray-800 rounded-[32px] rounded-bl-lg shadow-sm"
                }`}>
                  {msg.text}
                </div>
              </div>
            );
          })}
          
          {isTyping && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-gray-50 px-5 py-3 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Dr. Amy is typing...
              </div>
            </div>
          )}
        </div>

        {/* Input & Suggestions */}
        <div className="pb-32 pt-4 px-2 space-y-4">
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_MESSAGES.map((msg) => (
              <button
                key={msg}
                onClick={() => handleSend(msg)}
                className="px-4 py-2 rounded-full border border-orange-100 bg-orange-50/50 text-[10px] font-bold text-orange-400 hover:bg-orange-50 transition-colors"
              >
                {msg}
              </button>
            ))}
          </div>

          <div className="relative group">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(inputValue)}
              placeholder="Type your heart out..."
              className="w-full py-5 px-8 rounded-[40px] bg-white border border-gray-100 shadow-xl shadow-gray-100/50 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all"
            />
            <button
              onClick={() => handleSend(inputValue)}
              className="absolute right-3 top-2 h-11 w-11 rounded-full bg-orange-400 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all"
            >
              ↑
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
