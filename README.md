# 导航网站

一个简洁实用的导航网站，提供工具、学习、娱乐和资源类网站的分类导航。

## 功能特性

- 🎨 现代化的响应式设计，支持浅色/深色模式
- 📱 移动设备友好，适配各种屏幕尺寸
- 🚀 快速加载，优化的性能
- 🔍 支持网站搜索功能
- 📂 分类导航，按类别组织网站
- ⚙️ 可自定义的设置选项
- 📦 内置常用网站，持续更新

## 技术栈

- **前端**：Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion
- **后端**：Next.js API Routes
- **数据库**：SQLite
- **图标**：Lucide React

## 安装与运行

### 1. 克隆仓库

```bash
git clone https://github.com/Hongwei-name/menu-Web.git
cd menu-Web
```

### 2. 安装依赖

```bash
npm install
```

### 3. 运行开发服务器

```bash
npm run dev
```

### 4. 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
├── app/                # Next.js 应用目录
│   ├── api/            # API 路由
│   ├── admin/          # 后台管理页面
│   ├── page.tsx        # 主页
│   └── layout.tsx      # 布局组件
├── components/         # 可复用组件
├── data/               # 数据库文件
├── lib/                # 工具函数和数据库操作
├── public/             # 静态资源
│   └── logos/          # 网站图标
├── .env.local          # 环境变量
├── package.json        # 项目配置
└── README.md           # 项目说明
```

## 主要功能

### 前台功能
- 网站分类浏览
- 网站搜索
- 深色/浅色模式切换
- 网格/列表布局切换
- 设置管理

### 后台功能
- 分类管理
- 网站管理
- 系统设置

## 数据库结构

### urls 表
- `id` (TEXT): 网站ID
- `title` (TEXT): 网站标题
- `url` (TEXT): 网站URL
- `category` (TEXT): 分类
- `description` (TEXT): 网站描述
- `logo_path` (TEXT): 图标路径
- `created_at` (DATETIME): 创建时间
- `updated_at` (DATETIME): 更新时间

### categories 表
- `id` (TEXT): 分类ID
- `name` (TEXT): 分类名称
- `color` (TEXT): 分类颜色
- `created_at` (DATETIME): 创建时间

### settings 表
- `key` (TEXT): 设置键
- `value` (TEXT): 设置值
- `updated_at` (DATETIME): 更新时间

## 自定义设置

1. **主题设置**：在前台设置中切换深色/浅色模式
2. **布局设置**：在前台设置中切换网格/列表布局
3. **系统设置**：在后台管理中配置网站名称、描述等

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 许可证

MIT License

## 联系方式

如有问题或建议，请通过以下方式联系：
- GitHub Issues
- 邮箱：3485581538@qq.com

## 署名

**作者**：陈洪伟

---

**导航网站** - 简洁实用的导航工具，为您提供便捷的网站访问体验 🚀