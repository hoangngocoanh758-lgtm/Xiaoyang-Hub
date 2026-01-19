# 小阳AI工具箱（B站字幕提取助手）

这是一个基于 Vue 3 + Vue Router + Vuex + Tailwind CSS 的前端项目，主功能为 B 站 AI 字幕提取与格式转换，同时提供网址导航、作品展示与关于页面。

## 演示链接

- 在线演示：暂未部署（可使用本地开发启动）

## 项目截图

![导航页](https://placehold.co/1200x700/png?text=Navigation)
![工具箱](https://placehold.co/1200x700/png?text=Toolbox)
![字幕提取助手](https://placehold.co/1200x700/png?text=Subtitle+Extractor)

## 功能概览

- B 站 AI 字幕解析与预览
- 字幕导出格式支持（SRT / TXT）
- 网址导航页与工具箱入口
- 作品一览与关于页面
- 统一的顶部导航与路由标题

## 技术栈

- Vue 3
- Vue Router 4
- Vuex 4
- Tailwind CSS
- Vue CLI 5
- Jest + Cypress

## 本地开发

推荐使用 pnpm，也可使用 npm。

```bash
pnpm install
pnpm dev
```

或

```bash
npm install
npm run dev
```

## 构建与检查

```bash
npm run build
```

```bash
npm run lint
```

## 测试

```bash
npm run test:unit
```

```bash
npm run test:e2e
```

## 部署说明

### 静态站点部署

1. 构建产物

```bash
npm run build
```

2. 将 dist/ 目录上传到静态服务器或对象存储并开启静态托管

### Vercel / Netlify

- Build Command：npm run build
- Output Directory：dist

## 目录结构

```
public/              静态入口
src/
  assets/            样式资源
  components/        业务组件
  router/            路由配置
  services/          字幕解析与预览逻辑
  store/             Vuex 状态管理
  views/             页面视图
tests/               单元测试与端到端测试
```

## 使用说明

1. 打开 AI 工具箱页面，进入字幕提取助手
2. 从 B 站开发者工具 Network 中获取 ai_subtitle 的响应 JSON
3. 将 JSON 粘贴到输入框，系统将自动解析并预览
4. 选择导出格式并复制或下载

## 开发约定

- 前端依赖建议使用淘宝 NPM 镜像：registry.npmmirror.com

## License

本仓库为个人项目示例用途。
