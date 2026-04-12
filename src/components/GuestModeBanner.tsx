// Guest Mode Banner - Prompts users to sign in to save progress

import { motion } from "framer-motion";
import { LogIn, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function GuestModeBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-lg p-3 mb-4 flex items-center justify-between gap-3 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-500/20 rounded-lg">
          <LogIn className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-emerald-300">
            Sign in to save your progress
          </p>
          <p className="text-xs text-gray-400">
            Your conversations will be saved permanently and synced across devices
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link to="/auth">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20"
          >
            Sign In
          </Button>
        </Link>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setDismissed(true)}
          className="p-1 hover:bg-gray-700/50 rounded transition-colors"
        >
          <X className="w-4 h-4 text-gray-400 hover:text-gray-300" />
        </motion.button>
      </div>
    </motion.div>
  );
}
