"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Moon, Sun, LayoutGrid, List, Palette, Globe } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
  isGridView: boolean;
  onLayoutToggle: () => void;
}

/**
 * 前台设置模态框组件
 * 允许用户调整基本设置
 */
export function SettingsModal({ 
  isOpen, 
  onClose, 
  isDarkMode, 
  onThemeToggle, 
  isGridView, 
  onLayoutToggle 
}: SettingsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">设置</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="关闭"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              {/* 外观设置 */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  外观设置
                </h4>
                
                <div className="space-y-4">
                  {/* 主题切换 */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        暗黑模式
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {isDarkMode ? "已启用" : "已禁用"}
                      </p>
                    </div>
                    <button
                      onClick={onThemeToggle}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isDarkMode ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isDarkMode ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* 布局切换 */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        布局模式
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {isGridView ? "网格布局" : "列表布局"}
                      </p>
                    </div>
                    <button
                      onClick={onLayoutToggle}
                      className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-600 transition-colors"
                    >
                      {isGridView ? (
                        <List className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      ) : (
                        <LayoutGrid className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* 关于 */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  关于
                </h4>
                
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    导航网站 v1.0.0
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    简洁实用的导航工具，为您提供便捷的网站访问体验
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onClose}
                className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                关闭
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}