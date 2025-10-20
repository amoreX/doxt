"use client";

import { motion } from "framer-motion";
import { ChatAreaProps } from "@/types/dashboard";
import EmptyState from "./EmptyState";

export default function ChatArea({ messages }: ChatAreaProps) {
  if (messages.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-6">
      {messages.map((msg, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.05 }}
          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[80%] px-6 py-4 rounded-2xl  ${
              msg.role === "user"
                ? "bg-slate-800 text-white shadow-lg shadow-slate-800/20"
                : "bg-white/80 backdrop-blur-sm border border-s-slate-600 text-slate-800"
            }`}
          >
            <p className="text-sm leading-relaxed">{msg.content}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
