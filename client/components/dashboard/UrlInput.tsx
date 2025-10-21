"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, X } from "@phosphor-icons/react";
import { UrlInputProps } from "@/types/dashboard";

export default function UrlInput({ attachedUrls, onAddUrl, onRemoveUrl, showInput, onToggleInput }: UrlInputProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Only allow 1 URL maximum
    if (url.trim() && !attachedUrls.includes(url.trim()) && attachedUrls.length === 0) {
      onAddUrl(url.trim());
      setUrl("");
      onToggleInput();
    }
  };

  return (
    <div className="space-y-3">
      {/* URL Input Form */}
      <AnimatePresence>
        {showInput && attachedUrls.length === 0 && (
          <motion.form
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onSubmit={handleSubmit}
            className="flex gap-2 justify-center"
          >
            <div className="w-96 relative">
              <Link
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                weight="regular"
              />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter website URL..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-white/90 backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all duration-300 text-sm"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={onToggleInput}
              className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Attached URLs */}
      <AnimatePresence>
        {attachedUrls.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-wrap gap-2 justify-center"
          >
            {attachedUrls.map((attachedUrl, index) => (
              <motion.div
                key={attachedUrl}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-100 border border-blue-200 text-blue-700 text-sm"
              >
                <Link className="w-4 h-4 flex-shrink-0" weight="bold" />
                <span className="truncate max-w-xs">{attachedUrl}</span>
                <button
                  onClick={() => onRemoveUrl(attachedUrl)}
                  className="p-0.5 rounded hover:bg-blue-200 transition-colors"
                >
                  <X className="w-3.5 h-3.5" weight="bold" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
