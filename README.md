# Snake Game

一个经典的贪吃蛇游戏，使用 TypeScript 和 Vite 构建。

## 功能特性

- 经典贪吃蛇玩法
- 响应式设计，支持键盘和触摸控制
- 粒子效果和主题切换
- 高性能游戏循环（60fps）
- 跨浏览器兼容

## 技术栈

- **前端框架**: Vanilla TypeScript
- **构建工具**: Vite
- **测试框架**: Vitest
- **代码质量**: ESLint, Prettier
- **样式**: CSS

## 安装和运行

### 前置要求

- Node.js (版本 16 或更高)
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

打开浏览器访问 `http://localhost:5173`

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

### 运行测试

```bash
npm run test
```

### 代码格式化和检查

```bash
npm run lint
npm run format
```

## 游戏控制

- **键盘**: 方向键或 WASD 移动
- **触摸**: 在移动设备上滑动控制

## 项目结构

```
src/
├── components/     # React 组件
├── game/          # 游戏常量
├── hooks/         # 自定义 React Hooks
├── store/         # 状态管理
├── styles/        # 样式文件
├── types/         # TypeScript 类型定义
└── utils/         # 工具函数
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License