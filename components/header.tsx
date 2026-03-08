"use client";

import { motion } from "framer-motion";
import { Search, LayoutGrid, List, Moon, Sun, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { SettingsModal } from "./settings-modal";

interface HeaderProps {
  onSearch: (query: string) => void;
  onLayoutToggle: () => void;
  isGridView: boolean;
  onThemeToggle: () => void;
  isDarkMode: boolean;
  siteName?: string;
}

/**
 * 顶部导航栏组件
 * 包含品牌Logo、搜索栏和功能按钮
 */
export function Header({ onSearch, onLayoutToggle, isGridView, onThemeToggle, isDarkMode, siteName = "导航网站" }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, onSearch]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    setIsSettingsOpen(false);
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "shadow-md bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg" : "bg-transparent"
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-16">
            {/* 品牌/Logo区 */}
            <motion.div
              className="flex items-center gap-2 md:gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary flex items-center justify-center hover:scale-105 transition-transform duration-300">
                <span className="text-white font-bold text-sm md:text-lg">N</span>
              </div>
              <span className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">{siteName}</span>
            </motion.div>

            {/* 搜索栏 - 仅在中等尺寸及以上显示 */}
            <motion.div
              className="hidden md:block flex-1 max-w-md md:max-w-2xl mx-4 md:mx-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                scale: isSearchFocused ? 1.02 : 1
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索工具或网站..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full pl-12 pr-4 py-2.5 bg-neutral-100 dark:bg-gray-800 border border-transparent rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                />
              </div>
            </motion.div>

            {/* 功能入口区 */}
            <motion.div
              className="flex items-center gap-2 md:gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* 移动端搜索按钮 */}
              <button className="md:hidden p-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105">
                <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>

              <button
                onClick={onThemeToggle}
                className="p-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105"
                title={isDarkMode ? "切换到亮色模式" : "切换到暗色模式"}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>

              <button
                onClick={handleSettingsClick}
                className="p-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105"
                title="设置"
              >
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* 设置模态框 */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={handleSettingsClose}
        isDarkMode={isDarkMode}
        onThemeToggle={onThemeToggle}
        isGridView={isGridView}
        onLayoutToggle={onLayoutToggle}
      />
    </>
  );
}
