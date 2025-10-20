"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const dynamicPhrases = [
  "help you",
  "summarize pages",
  "analyze content",
  "extract insights",
  "answer queries",
  "process documents",
];

export default function EmptyState() {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % dynamicPhrases.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-light tracking-tight text-slate-800 mb-3">
          <span>Hi, how can Doxt </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={currentPhraseIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-slate-700 inline-block"
            >
              {dynamicPhrases[currentPhraseIndex]}
            </motion.span>
          </AnimatePresence>{" "}
          <span className="text-white bg-slate-900 px-2 rounded-md">
            today?
          </span>
        </h2>
        <p className="text-slate-500">
          Start a conversation and ask me anything
        </p>
      </motion.div>
    </div>
  );
}
