"use client";

import { motion } from "framer-motion";
import { ExternalLink, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Category } from "@/lib/nav-data";

interface NavCardProps {
  title: string;
  description: string;
  url: string;
  category: Category;
  logo?: string;
  logo_path?: string;
  icon?: React.ReactNode;
  index: number;
  isGridView: boolean;
}

const categoryColors = {
  tools: "bg-primary/10 text-primary dark:text-primary-400",
  learning: "bg-secondary/10 text-secondary dark:text-secondary-400",
  entertainment: "bg-accent/10 text-accent dark:text-accent-400",
  resources: "bg-red-500/10 text-red-600 dark:text-red-400",
};

const categoryBorderColors = {
  tools: "border-primary",
  learning: "border-secondary",
  entertainment: "border-accent",
  resources: "border-red-500",
};

export function NavCard({ title, description, url, category, logo, logo_path, icon, index, isGridView }: NavCardProps) {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative block transition-all duration-300",
        isGridView ? "aspect-[4/3]" : "aspect-[5/2]"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className={cn(
          "glass-effect rounded-xl p-4 h-full flex flex-col justify-between",
          "hover:card-hover",
          "border-b-2 border-transparent",
          `hover:${categoryBorderColors[category]}`
        )}
      >
        <div className={cn(
          "flex items-start gap-4",
          isGridView ? "flex-col" : "flex-row"
        )}>
          <div
            className={cn(
              "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
              categoryColors[category]
            )}
          >
            {(logo || logo_path) ? (
              <Image
                src={logo_path || logo as string}
                alt={title}
                width={32}
                height={32}
                className="w-6 h-6 object-contain"
              />
            ) : icon ? (
              <div className="w-5 h-5">{icon}</div>
            ) : (
              <ImageIcon className="w-5 h-5" />
            )}
          </div>

          <div className={cn(
            "flex-1 min-w-0",
            isGridView ? "w-full" : "flex-1"
          )}>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate mb-1">
              {title}
            </h3>
            <p className={cn(
              "text-sm text-gray-600 dark:text-gray-400 leading-relaxed",
              isGridView ? "line-clamp-2" : "line-clamp-1"
            )}>
              {description}
            </p>
          </div>

          <ExternalLink className={cn(
            "w-4 h-4 text-gray-400 transition-all duration-300",
            "opacity-70 group-hover:opacity-100",
            isGridView ? "absolute top-4 right-4" : "flex-shrink-0"
          )} />
        </div>
      </div>
    </motion.a>
  );
}
