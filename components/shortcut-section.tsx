"use client";

import { motion } from "framer-motion";
import { Home, Star, Clock, Download, Heart, Bookmark, Share2, Settings } from "lucide-react";

interface ShortcutItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  url: string;
  color: string;
}

/**
 * 快捷访问区组件
 * 展示常用功能的快捷入口
 */
export function ShortcutSection() {
  const shortcuts: ShortcutItem[] = [
    {
      id: "home",
      icon: <Home className="w-5 h-5 text-white" />,
      label: "首页",
      url: "/",
      color: "bg-primary"
    },
    {
      id: "favorites",
      icon: <Star className="w-5 h-5 text-white" />,
      label: "收藏",
      url: "#",
      color: "bg-accent"
    },
    {
      id: "history",
      icon: <Clock className="w-5 h-5 text-white" />,
      label: "历史",
      url: "#",
      color: "bg-secondary"
    },
    {
      id: "downloads",
      icon: <Download className="w-5 h-5 text-white" />,
      label: "下载",
      url: "#",
      color: "bg-green-500"
    },
    {
      id: "likes",
      icon: <Heart className="w-5 h-5 text-white" />,
      label: "喜欢",
      url: "#",
      color: "bg-red-500"
    },
    {
      id: "bookmarks",
      icon: <Bookmark className="w-5 h-5 text-white" />,
      label: "书签",
      url: "#",
      color: "bg-purple-500"
    },
    {
      id: "share",
      icon: <Share2 className="w-5 h-5 text-white" />,
      label: "分享",
      url: "#",
      color: "bg-orange-500"
    },
    {
      id: "settings",
      icon: <Settings className="w-5 h-5 text-white" />,
      label: "设置",
      url: "#",
      color: "bg-gray-500"
    }
  ];

  return (
    <motion.section
      className="mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">快捷访问</h2>
        <div className="flex overflow-x-auto pb-4 gap-4 md:flex-wrap md:justify-center lg:justify-start">
          {shortcuts.map((shortcut, index) => (
            <motion.a
              key={shortcut.id}
              href={shortcut.url}
              className="flex flex-col items-center gap-2 flex-shrink-0 min-w-[80px]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ 
                scale: 1.1, 
                rotate: 5,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`${shortcut.color} w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300`}>
                {shortcut.icon}
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 text-center">{shortcut.label}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </motion.section>
  );
}