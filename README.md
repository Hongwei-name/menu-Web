# zero_K导航站

一个纯前端、毛玻璃风格的个人网址导航站：多引擎搜索、分类管理、暗/亮主题，站点数据由外部 JSON 文件驱动，支持一键导入自己的 JSON 数据。

在线访问：[zero_K导航站](https://hongwei-name.github.io/menu-Web/)（部署后替换为实际地址）

## 技术栈

- Vue 3 + Vite + Pinia + vue-router
- 右键菜单：`@imengyu/vue3-context-menu`
- 纯前端，无后端：数据存 `public/data/nav.json` + 浏览器 localStorage

## 功能特性

- **多引擎搜索**：百度 / 必应 / Google / DuckDuckGo / GitHub / 知乎 / B站 一键切换，`/` 快捷键聚焦搜索，输入时即时过滤站内站点
- **左侧悬浮分类导航**：贴边细签收起，鼠标悬停平滑展开，滚动自动高亮当前分类，点击锚点跳转
- **分类管理**：设置面板内可新增 / 重命名 / 删除分类（删除连带清理其下站点）
- **站点增删改**：弹窗表单；右键卡片可编辑 / 删除（删除支持撤销）
- **图标三级兜底**：显式 icon → favicon.im（首选）→ DuckDuckGo → icon.horse → Google → 名称首字母彩色占位；结果缓存到 localStorage，二次访问秒开
- **主题与背景**：浅色 / 深色 / 跟随系统 + 7 色强调色换肤；背景支持渐变 / 本地图片（可上传）/ 必应每日一图
- **数据导入导出**：导出 / 复制 JSON、上传 .json 文件或粘贴 JSON，**可视化预览**（按分类渲染迷你站点卡片）确认后再应用
- **响应式**：卡片栅格自动换行，移动端适配

## 数据架构（外部 JSON 驱动）

- **主数据**：`public/data/nav.json` —— 改文件即可整体换站（部署后无需重新构建）
- **兜底数据**：`src/data/defaultNav.json` —— 拉取失败时使用
- **本地覆盖层**：界面上的增删改保存在 localStorage（`nav-overlay-v1`），按站点 id 与文件数据合并
- 设置面板提供：导出 / 复制 JSON、上传 / 粘贴导入（带可视化预览）、重新加载文件、清除本地修改

数据模型：

```jsonc
{
  "version": 1,
  "categories": [{ "id": "common", "name": "常用", "order": 0 }],
  "sites": [
    {
      "id": "weibo",
      "name": "微博",
      "url": "https://weibo.com",
      "icon": "",               // 可选，留空自动获取 favicon
      "desc": "随时随地发现新鲜事", // 可选
      "categoryId": "common",     // 必须对应 categories 中的 id
      "order": 0                  // 组内排序
    }
  ]
}
```

## 开发

```sh
npm install
npm run dev        # 启动开发服务器（默认 http://localhost:5173）
npm run build      # 构建到 dist/
npm run lint       # oxlint + eslint 检查并自动修复
```

## 发布

```sh
npm run build
```

把 `dist/` 目录内容上传到任意静态托管的**根目录**即可（资源使用根路径 `/assets/...`、`/data/nav.json`）。

若部署到子路径（如 GitHub Pages 的 `<user>.github.io/<repo>/`），需先修改 `vite.config.js` 的 `base` 为 `/<repo>/` 再重新构建。

部署后修改站点数据：直接编辑线上的 `data/nav.json`，刷新即生效，无需重新构建。

## 目录结构

```
public/
  data/nav.json        # ← 站点主数据（部署后可编辑）
  wallpapers/          # 本地壁纸
  favicon.ico / logo.png
src/
  data/defaultNav.json # 内置兜底数据
  stores/              # nav.js（数据+覆盖层合并）、settings.js（主题/背景/引擎）
  utils/               # icon.js / search.js / storage.js / url.js
  components/          # SiteCard / CategorySection / SearchBar / CategorySidebar / SiteModal / SettingsPanel
  views/MainLayout.vue # 页面骨架
```

## 作者

[zero_K](https://chwmwh.cn/) · [粤ICP备2026115501号](https://beian.miit.gov.cn/)
