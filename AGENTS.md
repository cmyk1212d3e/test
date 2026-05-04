# 项目说明

## 项目概览

这是一个宠物洗护店单页项目，品牌名为“泡泡爪 Pet Spa”。页面面向社区宠物洗护、美容与护理预约，包含首屏轮播、服务项目、护理标准、价位表、护理图库、门店信息和预约表单。

当前仓库同时存在两套表现形式：

- Next.js 应用：主要源码在 `app/` 和 `components/`，推荐作为主要维护入口。
- 独立静态页：根目录 `index.html` 是同一主题页面的静态 HTML/CSS/JS 版本，图片路径使用 `public/assets/...`。

## 技术栈

- Next.js `^15.3.0`
- React `^19.0.0`
- TypeScript `^5.7.3`
- Tailwind CSS `^3.4.17`
- ESLint `^9.20.1`，使用 `next/core-web-vitals` 和 `next/typescript`

## 常用命令

```bash
npm run dev
npm run build
npm run start
npm run lint
```

说明：

- `npm run dev` 实际执行 `next dev --turbo`。
- `npm run lint` 执行 `eslint .`。
- 依赖已安装在 `node_modules/`，但该目录不应提交。

## 目录结构

```text
app/
  globals.css       全局样式，包含 Tailwind 指令和页面的大部分自定义 CSS
  layout.tsx        根布局，设置 metadata 与 html lang="zh-CN"
  page.tsx          首页入口，渲染 PetSpaLanding

components/
  pet-spa-landing.tsx
                    主要客户端组件，包含页面数据、交互和完整 JSX

public/assets/
  service-basic-bath.png
  service-cat-care.png
  service-coat-spa.png
  service-styling-trim.png
  store-grooming.png
  store-map-ai.png
  store-reception.png
  store-spa.png

assets/             当前为空
index.html          独立静态版本页面
```

构建产物和缓存目录包括 `.next/`、`out/`、`build/`、`dist/` 等，已在 `.gitignore` 中忽略。

## Next.js 应用结构

- `app/page.tsx` 只负责引入并返回 `PetSpaLanding`。
- `app/layout.tsx` 设置页面标题为“泡泡爪 Pet Spa | 宠物洗护店”，描述为“社区宠物洗护、美容与护理预约页面。”。
- `components/pet-spa-landing.tsx` 是 `"use client"` 组件，负责所有页面内容和交互。

`PetSpaLanding` 内部的数据主要包括：

- `heroSlides`：首屏轮播图，使用门店接待区、水疗区、吹干造型区图片。
- `services`：6 个洗护项目。
- `prices`：4 个套餐价位，其中“中型犬全身精护”为热门。
- `addOns`：6 个加项价位。
- `gallery`：3 个护理图库展示项。

组件交互：

- 首屏轮播每 `4200ms` 自动切换。
- 点击轮播点会切换当前图片，并重置轮播计时。
- 点击价位卡片的“选择套餐”会把套餐写入预约表单的意向套餐下拉框。
- 提交预约表单不会调用后端，只在前端阻止默认提交并显示“预约已记录，稍后会电话确认”的状态文案，然后重置表单。

## 样式与设计约定

- Tailwind 通过 `app/globals.css` 引入，但当前页面主要使用自定义 class 和 CSS 变量。
- 主要 CSS 变量定义在 `:root`，包括：
  - `--ink`
  - `--muted`
  - `--line`
  - `--paper`
  - `--mist`
  - `--mint`
  - `--teal`
  - `--coral`
  - `--gold`
  - `--shadow`
- Tailwind 主题在 `tailwind.config.ts` 中扩展了同名颜色、`soft` 阴影和中文友好的 sans 字体栈。
- 页面响应式断点主要写在 `globals.css` 的 `1040px`、`880px`、`560px` 媒体查询中。
- 视觉风格是清爽、温和、社区门店感，色彩以纸白、薄荷、青绿、珊瑚橙和金色强调为主。

## 静态资源

Next.js 组件中的图片路径使用 `/assets/...`，对应 `public/assets/` 下的文件。

`next.config.ts` 允许 `images.unsplash.com` 作为远程图片来源，但当前主组件使用的都是本地 `public/assets` 图片。

`index.html` 静态版本中图片路径写作 `public/assets/...`，适合直接从文件系统打开时使用。

## TypeScript 与路径别名

`tsconfig.json` 开启严格模式：

- `strict: true`
- `noEmit: true`
- `moduleResolution: "bundler"`
- `jsx: "preserve"`

路径别名：

```json
"@/*": ["./*"]
```

因此可以像 `app/page.tsx` 一样使用：

```ts
import { PetSpaLanding } from "@/components/pet-spa-landing";
```

## 代码质量与格式注意

- `.gitattributes` 设置 `* text=auto eol=lf`，应保持 LF 换行。
- 中文内容建议用 UTF-8 读取和保存。Windows PowerShell 默认读取时可能出现中文乱码，读取源码可使用 `Get-Content -Encoding UTF8`。
- 不要提交 `.next/`、`node_modules/`、日志、环境变量文件和编辑器配置目录。
- 目前没有测试框架配置；变更后至少运行 `npm run lint`，涉及构建行为时运行 `npm run build`。

## 已知维护建议

- Next.js 应用和根目录 `index.html` 内容高度相似。修改文案、价格、图片或样式时，先确认是否需要同步两处。
- 预约表单目前只是前端演示，没有真实提交、校验手机号格式或后端接口。
- SVG 图标直接写在组件内，包括爪印、瓶子、吹干和盾牌图标；没有引入图标库。
- `assets/` 根目录当前为空，正式静态资源应优先放在 `public/assets/`。
