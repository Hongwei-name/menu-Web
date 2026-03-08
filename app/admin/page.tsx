"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  Plus, 
  FolderPlus, 
  Download, 
  TrendingUp,
  Link as LinkIcon,
  Clock,
  BarChart3,
  ArrowRight
} from "lucide-react";

export default function AdminDashboard() {
  const [totalUrls, setTotalUrls] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState({
    tools: 0,
    learning: 0,
    entertainment: 0,
    resources: 0,
  });
  const [recentUrls, setRecentUrls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [urlsResponse, categoriesResponse] = await Promise.all([
        fetch("/api/urls"),
        fetch("/api/categories"),
      ]);

      if (!urlsResponse.ok || !categoriesResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const urls = await urlsResponse.json();
      const categories = await categoriesResponse.json();

      setTotalUrls(urls.length);
      setRecentUrls(urls.slice(0, 5));

      const counts = {
        tools: urls.filter((item: any) => item.category === "tools").length,
        learning: urls.filter((item: any) => item.category === "learning").length,
        entertainment: urls.filter((item: any) => item.category === "entertainment").length,
        resources: urls.filter((item: any) => item.category === "resources").length,
      };
      setCategoryCounts(counts);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            仪表盘
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            欢迎回来，管理员
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/urls"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            添加网址
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">网址总数</p>
              <p className="text-3xl font-bold mt-2">{totalUrls}</p>
            </div>
            <LinkIcon className="w-8 h-8 opacity-80" />
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm opacity-90">
            <TrendingUp className="w-4 h-4" />
            <span>较上月增长 12%</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">工具类</p>
              <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
                {categoryCounts.tools}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${(categoryCounts.tools / totalUrls) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">学习类</p>
              <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
                {categoryCounts.learning}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${(categoryCounts.learning / totalUrls) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">娱乐类</p>
              <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
                {categoryCounts.entertainment}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-600 rounded-full transition-all duration-500"
              style={{ width: `${(categoryCounts.entertainment / totalUrls) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              最近添加
            </h2>
            <Link
              href="/admin/urls"
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              查看全部
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentUrls.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center">
                    <LinkIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.url}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {index + 1} 小时前
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            快捷操作
          </h2>
          <div className="space-y-3">
            <Link
              href="/admin/urls"
              className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-200 dark:hover:border-indigo-800 border border-transparent transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center">
                <Plus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  添加网址
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  新增一个导航网址
                </p>
              </div>
            </Link>

            <Link
              href="/admin/categories"
              className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-200 dark:hover:border-emerald-800 border border-transparent transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                <FolderPlus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  添加分类
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  创建新的分类
                </p>
              </div>
            </Link>

            <button className="w-full flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-200 dark:hover:border-amber-800 border border-transparent transition-all">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                <Download className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">
                  导出数据
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  下载所有网址数据
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          分类统计
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  工具类
                </p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {categoryCounts.tools}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  学习类
                </p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {categoryCounts.learning}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  娱乐类
                </p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {categoryCounts.entertainment}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-pink-500 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  资源类
                </p>
                <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                  {categoryCounts.resources}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
