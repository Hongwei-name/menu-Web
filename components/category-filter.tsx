"use client";

import { motion } from "framer-motion";
import { Category } from "@/lib/nav-data";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selectedCategory: Category | "all";
  onCategoryChange: (category: Category | "all") => void;
}

const categories = [
  { id: "all" as const, label: "全部", icon: "🌟" },
  { id: "tools" as const, label: "工具类", icon: "🔧" },
  { id: "learning" as const, label: "学习类", icon: "📚" },
  { id: "entertainment" as const, label: "娱乐类", icon: "🎮" },
  { id: "resources" as const, label: "资源类", icon: "💎" },
];

const categoryStyles = {
  all: "bg-primary text-white hover:bg-primary-600",
  tools: "bg-primary text-white hover:bg-primary-600",
  learning: "bg-secondary text-white hover:bg-secondary-600",
  entertainment: "bg-accent text-white hover:bg-accent-600",
  resources: "bg-red-500 text-white hover:bg-red-600",
};

const categoryInactiveStyles = {
  all: "bg-neutral-100 text-gray-700 hover:bg-neutral-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700",
  tools: "bg-neutral-100 text-gray-700 hover:bg-neutral-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700",
  learning: "bg-neutral-100 text-gray-700 hover:bg-neutral-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700",
  entertainment: "bg-neutral-100 text-gray-700 hover:bg-neutral-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700",
  resources: "bg-neutral-100 text-gray-700 hover:bg-neutral-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700",
};

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <motion.div
      className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {categories.map((category) => (
        <motion.button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap",
            selectedCategory === category.id
              ? categoryStyles[category.id]
              : categoryInactiveStyles[category.id]
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>{category.icon}</span>
          <span>{category.label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
}
