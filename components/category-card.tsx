"use client";

import { motion } from "framer-motion";
import { ExternalLink, ChevronRight } from "lucide-react";
import { Category } from "@/lib/nav-data";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CategoryCardProps {
  category: {
    id: Category;
    name: string;
    icon: string;
    color: string;
  };
  items: {
    id: string;
    title: string;
    description: string;
    url: string;
    logo?: string;
  }[];
  index: number;
}

const categoryColors = {
  tools: "bg-primary/10 border-primary",
  learning: "bg-secondary/10 border-secondary",
  entertainment: "bg-accent/10 border-accent",
  resources: "bg-red-500/10 border-red-500",
};

const categoryTextColors = {
  tools: "text-primary",
  learning: "text-secondary",
  entertainment: "text-accent",
  resources: "text-red-500",
};

/**
 * 分类卡片组件
 * 展示一个分类及其包含的导航链接
 */
export function CategoryCard({ category, items, index }: CategoryCardProps) {
  return (
    <motion.div
      className={cn(
        "bg-neutral-100 dark:bg-gray-800 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700",
        "p-6 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1",
        categoryColors[category.id]
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            categoryColors[category.id]
          )}>
            <span className="text-lg">{category.icon}</span>
          </div>
          <h3 className={cn(
            "text-lg font-semibold",
            categoryTextColors[category.id]
          )}>
            {category.name}
          </h3>
        </div>
        <button className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors">
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, itemIndex) => (
          <motion.a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 group"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 + itemIndex * 0.05 }}
            whileHover={{ x: 4 }}
          >
            {item.logo ? (
              <Image
                src={item.logo}
                alt={item.title}
                width={24}
                height={24}
                className="w-6 h-6 object-contain flex-shrink-0"
              />
            ) : (
              <div className="w-6 h-6 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:underline">
                {item.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {item.description}
              </p>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}