"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  icon: React.ReactNode;
  index: number;
}

export function SectionHeader({ title, icon, index }: SectionHeaderProps) {
  return (
    <motion.div
      className="flex items-center gap-3 mb-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500/20 to-rose-500/20">
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      <div className="flex-1 h-px bg-gradient-to-r from-pink-200/50 to-transparent" />
      <ChevronRight className="w-5 h-5 text-pink-400" />
    </motion.div>
  );
}
