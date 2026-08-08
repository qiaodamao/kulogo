# 酷设计 SVG Logo 素材库

一个现代化的 SVG Logo 素材库，专注收录国内外矢量 LOGO，为设计师和开发者提供高质量的品牌标识资源。

## 功能特点

- 🔍 关键词搜索与分类筛选
- 🌓 深色/浅色主题切换，支持自动保存主题偏好
- 📋 一键复制 SVG 到剪贴板，支持复制 PNG 格式
- ⬇️ 单个/批量下载 SVG
- 🏷️ 支持多选和批量下载
- 📱 响应式设计，适配移动端和桌面端
- ✨ 流畅的动画效果，包括滚动 Logo 展示
- 🎯 分类筛选，左侧边栏显示分类和数量
- 🔄 排序功能，支持最近更新、A-Z 排序
- 🏠 导航菜单，包含首页、关于我们、赞助支持等
- 📊 集成百度统计和 Google 广告
- 🎨 现代化 UI 设计，包含 Hero 区域滚动效果

## 技术栈

- **Next.js 14** - React 框架，使用 App Router
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Framer Motion** - 动画库
- **Sonner** - 通知组件
- **JSZip** - 压缩文件
- **Clipboard API** - 复制功能
- **Canvas API** - PNG 复制功能
- **LocalStorage** - 主题偏好存储
- **Cookies** - 服务端主题检测

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 本地开发

```bash
pnpm dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
pnpm build
```

## 添加新 Logo

### 1. 放置 SVG 文件

将 SVG 文件放入对应分类文件夹：

```
public/library/
  ├── aigc/           # AI 产品
  ├── airline/        # 航空公司
  ├── company/        # 企业组织
  ├── cosmetic/       # 美妆品牌
  ├── goldJewelry/  # 黄金珠宝
  ├── other/        # 其他
  ├── pay/          # 金融支付
  ├── school/       # 大学校徽
  ├── social/       # 社交媒体
  ├── tools/        # 工具产品
  └── weather/      # 气象预警
```

### 2. 扫描 SVG 文件

```bash
pnpm scan:svg
```

### 3. 生成数据文件

```bash
pnpm generate:svg
```

## 部署

### 部署到 Vercel

1. 导入项目到 GitHub
2. 在 Vercel 中导入仓库
3. 自动部署

### 部署到 Cloudflare Pages

1. 创建 Pages 项目
2. 构建命令：`pnpm build`
3. 输出目录：`.next`
4. 部署

### 部署到腾讯 EdgeOne

1. 创建 EdgeOne 站点
2. 配置构建命令：`pnpm build`
3. 部署

## 项目结构

```
svg-logo-library/
├── public/
│   ├── images/          # 网站图片资源
│   └── library/         # SVG 资源文件
│       ├── aigc/        # AI 产品
│       ├── airline/     # 航空公司
│       ├── company/     # 企业组织
│       ├── cosmetic/    # 美妆品牌
│       ├── goldJewelry/ # 黄金珠宝
│       ├── other/       # 其他
│       ├── pay/         # 金融支付
│       ├── school/      # 大学校徽
│       ├── social/      # 社交媒体
│       ├── tools/       # 工具产品
│       └── weather/     # 气象预警
├── scripts/
│   ├── scan-svgs.ts     # 扫描 SVG 文件
│   ├── generate-svgs.ts # 生成 SVG 数据
│   └── title-mappings.json # 标题映射
├── src/
│   ├── app/            # Next.js 页面
│   │   ├── about/      # 关于我们页面
│   │   ├── sponsor/    # 赞助支持页面
│   │   ├── globals.css # 全局样式
│   │   ├── layout.tsx  # 根布局
│   │   └── page.tsx    # 首页
│   ├── components/      # 组件
│   │   ├── Analytics.tsx    # 统计分析
│   │   ├── Footer.tsx       # 页脚
│   │   ├── GoogleAds.tsx    # Google 广告
│   │   └── Header.tsx       # 头部导航
│   ├── data/            # 数据文件
│   │   ├── categories.ts # 分类数据
│   │   └── svgs.ts       # SVG 数据
│   ├── lib/             # 工具函数
│   │   └── utils.ts      # 通用工具
│   ├── types/           # 类型定义
│   │   └── svg.ts        # SVG 类型
│   └── config.ts        # 项目配置
├── package.json         # 依赖管理
├── next.config.js       # Next.js 配置
├── tailwind.config.ts   # Tailwind 配置
├── tsconfig.json        # TypeScript 配置
├── vercel.json          # Vercel 配置
└── wrangler.toml        # Cloudflare 配置
```

## 作者介绍

**乔同学** - 专注于前端开发和设计资源整理，致力于为设计师和开发者提供高质量的品牌标识资源。

- 项目地址: [https://github.com/xmbsm/kulogo](https://github.com/xmbsm/kulogo)
- 官方网站: [https://kusheji.com](https://kusheji.com)

## 开源协议

MIT License

## 致谢

感谢所有为项目贡献的开发者和设计师，以及提供 SVG Logo 资源的品牌方。

## 联系方式

如果您有任何问题或建议，欢迎通过以下方式联系我们：

- Email: 1@kusheji.com
- GitHub Issues: [项目 Issues](https://github.com/xmbsm/kulogo/issues)

## 致谢

- 开源项目 <a href="https://github.com/pheralb/svgl" target="_blank" rel="noopener noreferrer">svgl</a>
- 开源项目 <a href="https://github.com/HeyHuazi/SVGLOGO" target="_blank" rel="noopener noreferrer">svglogo</a>
- <a href="https://www.figma.com/community/file/916515339708288305" target="_blank" rel="noopener noreferrer">中国大学矢量校徽合集</a>
- 预警信号 <a href="https://www.figma.com/community/file/1133299341246601360/icon50" target="_blank" rel="noopener noreferrer">ICON</a>

---

**酷设计 SVG Logo 素材库** - 专注收录国内外矢量 LOGO，为设计师和开发者提供高质量的品牌标识资源。