"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/header";
import { CategoryFilter } from "@/components/category-filter";
import { CategoryCard } from "@/components/category-card";
import { Category } from "@/lib/nav-data";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isGridView, setIsGridView] = useState(true);
  const [navData, setNavData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isDark = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }

    const isGrid = localStorage.getItem("layout") !== "false";
    setIsGridView(isGrid);
  }, []);

  useEffect(() => {
    fetchNavData();
  }, [searchQuery]);

  const fetchNavData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      
      const response = await fetch(`/api/urls?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch URLs");
      
      const data = await response.json();
      setNavData(data);
    } catch (error) {
      console.error("Error fetching nav data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleThemeToggle = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", String(newMode));
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLayoutToggle = () => {
    const newLayout = !isGridView;
    setIsGridView(newLayout);
    localStorage.setItem("layout", String(newLayout));
  };

  // 分类配置
  const categories = [
    { id: "tools" as Category, name: "工具类", icon: "🔧", color: "primary" },
    { id: "learning" as Category, name: "学习类", icon: "📚", color: "secondary" },
    { id: "entertainment" as Category, name: "娱乐类", icon: "🎮", color: "accent" },
    { id: "resources" as Category, name: "资源类", icon: "💎", color: "red" },
  ];

  // 按分类分组数据
  const groupedData = categories.map(category => {
    const categoryItems = navData.filter(item => 
      item.category === category.id && 
      (selectedCategory === "all" || selectedCategory === category.id)
    );
    return {
      category,
      items: categoryItems
    };
  }).filter(group => group.items.length > 0);

  return (
    <main className="relative z-10 min-h-screen pt-20 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <Header
          onSearch={setSearchQuery}
          onLayoutToggle={handleLayoutToggle}
          isGridView={isGridView}
          onThemeToggle={handleThemeToggle}
          isDarkMode={isDarkMode}
        />

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="bg-neutral-100 dark:bg-gray-800 rounded-xl p-6 animate-pulse"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-neutral-200 dark:bg-gray-700"></div>
                    <div className="w-24 h-4 bg-neutral-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded bg-neutral-200 dark:bg-gray-700"></div>
                        <div className="flex-1 space-y-2">
                          <div className="w-full h-3 bg-neutral-200 dark:bg-gray-700 rounded"></div>
                          <div className="w-3/4 h-2 bg-neutral-200 dark:bg-gray-700 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : groupedData.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-gray-400 text-lg">未找到相关结果</p>
            </motion.div>
          ) : (
            <motion.div
              className={isGridView 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {groupedData.map((group, index) => (
                <CategoryCard
                  key={group.category.id}
                  category={group.category}
                  items={group.items}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.footer
          className="mt-20 text-center text-gray-500 dark:text-gray-500 text-xs py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <p>© 2026 导航网站 | 精心打造 · 持续更新</p>
        </motion.footer>
      </div>
    </main>
  );
}
