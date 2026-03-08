"use client";

import { useState, useEffect } from "react";
import { 
  Globe, 
  Palette, 
  Shield, 
  Save,
  Bell,
  Moon,
  Sun,
  Settings as SettingsIcon,
  Loader2
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    site_name: "导航网站",
    site_description: "简洁实用的导航网站",
    site_keywords: "导航, 工具, 资源, 学习, 娱乐",
    theme: "light",
    enable_dark_mode: "true",
    enable_notifications: "true",
    primary_color: "#165DFF",
    card_radius: "medium",
    card_shadow: "small",
    font_size: "medium",
    enable_animations: "true",
    show_category_icons: "true",
    admin_email: "admin@example.com",
    admin_password: "********",
    allow_guest_access: "true",
    allow_guest_search: "true",
    enable_api: "false",
    enable_export: "true"
  });

  const tabs = [
    { id: "basic", label: "基础设置", icon: Globe },
    { id: "style", label: "样式设置", icon: Palette },
    { id: "permission", label: "权限设置", icon: Shield },
  ];

  // 从后端加载设置
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/settings');
        if (!response.ok) throw new Error('Failed to fetch settings');
        
        const data = await response.json();
        setSettings(prev => ({
          ...prev,
          ...data
        }));
      } catch (error) {
        console.error('Error fetching settings:', error);
        setError('加载设置失败');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // 保存设置到后端
  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError(null);

      // 逐个保存设置项
      for (const [key, value] of Object.entries(settings)) {
        const response = await fetch('/api/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ key, value })
        });

        if (!response.ok) throw new Error(`Failed to save setting: ${key}`);
      }

      alert('设置保存成功！');
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('保存设置失败');
    } finally {
      setSaving(false);
    }
  };

  // 更新设置值
  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // 切换布尔类型设置
  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: prev[key] === 'true' ? 'false' : 'true'
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">加载设置中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          系统设置
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          配置网站的各项设置
        </p>
        {error && (
          <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex gap-4 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary dark:text-primary-400"
                      : "border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "basic" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  网站基础设置
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      网站名称
                    </label>
                    <input
                      type="text"
                      value={settings.site_name}
                      onChange={(e) => updateSetting('site_name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      网站描述
                    </label>
                    <textarea
                      rows={3}
                      value={settings.site_description}
                      onChange={(e) => updateSetting('site_description', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      网站关键词
                    </label>
                    <input
                      type="text"
                      value={settings.site_keywords}
                      onChange={(e) => updateSetting('site_keywords', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        启用暗黑模式
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        允许用户切换暗黑模式
                      </p>
                    </div>
                    <button
                      onClick={() => toggleSetting('enable_dark_mode')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.enable_dark_mode === 'true' ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.enable_dark_mode === 'true' ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        启用通知
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        接收系统通知和更新提醒
                      </p>
                    </div>
                    <button
                      onClick={() => toggleSetting('enable_notifications')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.enable_notifications === 'true' ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.enable_notifications === 'true' ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "style" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  样式设置
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      主题色
                    </label>
                    <div className="flex gap-3">
                      {[
                        { value: "#165DFF", label: "蓝色" },
                        { value: "#10B981", label: "绿色" },
                        { value: "#F59E0B", label: "橙色" },
                        { value: "#EC4899", label: "粉色" },
                        { value: "#8B5CF6", label: "紫色" }
                      ].map((color) => (
                        <button
                          key={color.value}
                          onClick={() => updateSetting('primary_color', color.value)}
                          className={`w-10 h-10 rounded-lg transition-all ${settings.primary_color === color.value ? 'ring-2 ring-offset-2' : 'hover:ring-2 hover:ring-offset-2'}`}
                          style={{ backgroundColor: color.value, boxShadow: settings.primary_color === color.value ? `0 0 0 2px ${color.value}` : 'none' }}
                          title={color.label}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      卡片圆角
                    </label>
                    <select 
                      value={settings.card_radius}
                      onChange={(e) => updateSetting('card_radius', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="small">小 (8px)</option>
                      <option value="medium">中 (12px)</option>
                      <option value="large">大 (16px)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      卡片阴影
                    </label>
                    <select 
                      value={settings.card_shadow}
                      onChange={(e) => updateSetting('card_shadow', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="none">无</option>
                      <option value="small">小</option>
                      <option value="medium">中</option>
                      <option value="large">大</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      字体大小
                    </label>
                    <select 
                      value={settings.font_size}
                      onChange={(e) => updateSetting('font_size', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="small">小</option>
                      <option value="medium">中</option>
                      <option value="large">大</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        启用动画效果
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        启用页面过渡和卡片动画
                      </p>
                    </div>
                    <button
                      onClick={() => toggleSetting('enable_animations')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.enable_animations === 'true' ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.enable_animations === 'true' ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        显示分类图标
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        在分类标签中显示图标
                      </p>
                    </div>
                    <button
                      onClick={() => toggleSetting('show_category_icons')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.show_category_icons === 'true' ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.show_category_icons === 'true' ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "permission" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  权限设置
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      管理员邮箱
                    </label>
                    <input
                      type="email"
                      value={settings.admin_email}
                      onChange={(e) => updateSetting('admin_email', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      管理员密码
                    </label>
                    <input
                      type="password"
                      value={settings.admin_password}
                      onChange={(e) => updateSetting('admin_password', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        允许访客访问
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        允许未登录用户访问前台页面
                      </p>
                    </div>
                    <button
                      onClick={() => toggleSetting('allow_guest_access')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.allow_guest_access === 'true' ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.allow_guest_access === 'true' ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        允许访客搜索
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        允许未登录用户使用搜索功能
                      </p>
                    </div>
                    <button
                      onClick={() => toggleSetting('allow_guest_search')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.allow_guest_search === 'true' ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.allow_guest_search === 'true' ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        启用 API 访问
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        允许通过 API 访问数据
                      </p>
                    </div>
                    <button
                      onClick={() => toggleSetting('enable_api')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.enable_api === 'true' ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.enable_api === 'true' ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        启用数据导出
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        允许导出导航数据
                      </p>
                    </div>
                    <button
                      onClick={() => toggleSetting('enable_export')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.enable_export === 'true' ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.enable_export === 'true' ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={handleSaveSettings}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "保存中..." : "保存设置"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
