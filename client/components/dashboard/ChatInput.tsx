"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PaperPlaneRight, Link, CloudArrowDown } from "@phosphor-icons/react";
import UrlInput from "./UrlInput";
import { ChatInputProps } from "@/types/dashboard";
import axios from "axios";

export default function ChatInput({ onSendMessage, onAddMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [attachedUrls, setAttachedUrls] = useState<string[]>([]);
  const [isAddingToContext, setIsAddingToContext] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    onSendMessage(message);
    setMessage("");
    setAttachedUrls([]);
  };

  const handleAddUrl = (url: string) => {
    setAttachedUrls([...attachedUrls, url]);
  };

  const handleRemoveUrl = (urlToRemove: string) => {
    setAttachedUrls(attachedUrls.filter((u) => u !== urlToRemove));
  };

  const handleAddToContext = async () => {
    if (attachedUrls.length === 0 || !onAddMessage) return;

    setIsAddingToContext(true);
    try {
      const response = await axios.post("http://localhost:5000/api/scrape", {
        url: attachedUrls[0],
      });

      onAddMessage({ role: "assistant", content: "URL SCRAPED" });
      onAddMessage({ role: "assistant", content: JSON.stringify(response.data, null, 2) });

      setAttachedUrls([]);
    } catch (error: any) {
      const errorMessage = `❌ Failed to scrape URL: ${error.response?.data?.error || error.message}`;
      onSendMessage(errorMessage);
    } finally {
      setIsAddingToContext(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex-shrink-0  backdrop-blur-md px-6 py-4"
    >
      <div className="max-w-3xl mx-auto space-y-3">
        {/* URL Input Section */}
        <UrlInput
          attachedUrls={attachedUrls}
          onAddUrl={handleAddUrl}
          onRemoveUrl={handleRemoveUrl}
          showInput={showUrlInput}
          onToggleInput={() => setShowUrlInput(!showUrlInput)}
        />

        {/* Add to Context Button */}
        <AnimatePresence>
          {attachedUrls.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center"
            >
              <button
                onClick={handleAddToContext}
                disabled={isAddingToContext}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
              >
                <CloudArrowDown className="w-4 h-4" weight="bold" />
                {isAddingToContext ? "Adding to context..." : "Add to context"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message Input */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask anything..."
              className="w-full px-6 py-4 pr-24 rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all duration-300 shadow-sm"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className={`p-2 rounded-xl transition-colors ${
                  showUrlInput || attachedUrls.length > 0
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-slate-100 text-slate-500"
                }`}
                title="Add website URL"
              >
                <Link className="w-5 h-5" weight="regular" />
              </button>
              <button
                type="submit"
                disabled={!message.trim()}
                className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
              >
                <PaperPlaneRight className="w-5 h-5" weight="bold" />
              </button>
            </div>
          </div>
        </form>

        <p className="text-xs text-slate-400 text-center">
          Doxt can make mistakes. Check important info.
        </p>
      </div>
    </motion.div>
  );
}
