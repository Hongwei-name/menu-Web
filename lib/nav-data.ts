export type Category = 'tools' | 'learning' | 'entertainment' | 'resources';

export interface NavItem {
  id: string;
  title: string;
  description: string;
  url: string;
  category: Category;
  icon?: string;
  logo?: string;
}

export interface NavSection {
  id: string;
  title: string;
  icon: string;
  items: NavItem[];
}

export const navData: NavItem[] = [
  {
    id: "image-convert",
    title: "图片格式转换",
    description: "在线图片格式转换工具，支持多种格式互转",
    url: "https://toolonline.net/convert-image",
    category: "tools",
    icon: "Image",
    logo: "/logos/toolonline.ico",
  },
  {
    id: "image-stitch",
    title: "图片拼接",
    description: "在线图片拼接工具，轻松合并多张图片",
    url: "https://www.lddgo.net/image/stitching-image",
    category: "tools",
    icon: "LayoutTemplate",
  },
  {
    id: "badge-generator",
    title: "徽章生成",
    description: "快速生成各种样式的徽章和标签",
    url: "https://api.kexig.cn/Shields/",
    category: "tools",
    icon: "Award",
  },
  {
    id: "hello-img",
    title: "Hello图床",
    description: "免费稳定的图片托管服务，支持外链",
    url: "https://www.helloimg.com",
    category: "resources",
    icon: "ImagePlus",
  },
  {
    id: "libvio",
    title: "Libvio看美剧",
    description: "高清美剧在线观看平台，资源丰富",
    url: "https://www.libvio.link/",
    category: "entertainment",
    icon: "MonitorPlay",
  },
  {
    id: "wallpaper",
    title: "免费高清壁纸",
    description: "海量高清壁纸下载，多种风格可选",
    url: "https://haowallpaper.com/",
    category: "resources",
    icon: "Image",
  },
  {
    id: "geogebra",
    title: "数学几何画图",
    description: "强大的数学几何绘图工具，适合教学和学习",
    url: "https://www.geogebra.org/classic?lang=zh_CN",
    category: "learning",
    icon: "Circle",
  },
  {
    id: "cet4",
    title: "英语四级",
    description: "英语四级真题和备考资料下载",
    url: "https://pastpapers.cn/cet-4/",
    category: "learning",
    icon: "GraduationCap",
  },
  {
    id: "python",
    title: "Python学习",
    description: "廖雪峰Python教程，从入门到精通",
    url: "https://liaoxuefeng.com/books/python/basic/index.html",
    category: "learning",
    icon: "Code2",
  },
  {
    id: "resume",
    title: "简历模板",
    description: "精美简历模板下载，助你求职成功",
    url: "https://www.jianlimoban-ziyuan.com/zhongwen/",
    category: "resources",
    logo: "/logos/jianlimoban.ico",
  },
  {
    id: "ventoy",
    title: "Ventoy安装",
    description: "Ventoy多系统启动盘制作教程",
    url: "https://juejin.cn/post/7501589510268059648",
    category: "resources",
    logo: "/logos/juejin.ico",
  },
  {
    id: "chrome-plugins",
    title: "Chrome插件下载站",
    description: "丰富的Chrome浏览器插件资源",
    url: "https://crxdl.com/",
    category: "resources",
    logo: "/logos/crxdl.ico",
  },
];
