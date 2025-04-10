# AI需求分析师

基于Remix框架和OpenAI API的智能需求分析工具，通过提示词工程，将需求文档转化为用户故事、需求实体和数据库设计。

## 项目截图
![image](https://github.com/MagicalLeo/Ai-Requirement-Analyzer/blob/main/images/main_page.jpg)
![image](https://github.com/MagicalLeo/Ai-Requirement-Analyzer/blob/main/images/project_page.png)

## 技术栈

- **前端框架**: [Remix](https://remix.run/)
- **UI框架**: [TailwindCSS](https://tailwindcss.com/)
- **数据库**: [Prisma](https://www.prisma.io/) + Mysql (可扩展至其他数据库)
- **认证**: 自定义实现的JWT会话认证
- **AI集成**: OpenAI API

## 主要功能

- 🔐 完整的用户认证系统（注册、登录、忘记密码）
- 📝 创建和管理需求项目
- 🤖 使用AI生成用户故事
- 🔍 自动识别和分析需求实体
- 💾 自动生成数据库设计
- 📊 用户友好的界面与交互体验

## 快速开始

### 前提条件

- Node.js 18+
- npm 或 yarn

### 安装步骤

1. 克隆仓库
   ```bash
   git clone https://github.com/yourusername/ai-requirements-analyzer.git
   cd ai-requirements-analyzer
   ```

2. 安装依赖
   ```bash
   npm install
   ```

3. 编辑环境变量
   ```bash
   vim .env
   # 编辑.env文件，填入必要的配置
   ```

4. 设置数据库
   ```bash
   npx prisma migrate dev --name init
   ```

5. 启动开发服务器
   ```bash
   npm run dev
   ```

6. 访问应用
   ```
   http://localhost:5173
   ```

## 环境变量配置

项目需要以下环境变量：

```
# 数据库配置
DATABASE_URL="file:./dev.db"

# 会话安全密钥
SESSION_SECRET="your-super-secret-session-key-change-this-in-production"

# OpenAI API密钥
OPENAI_API_KEY="your-openai-api-key"

# 应用URL - 用于生成密码重置链接
APP_URL="http://localhost:5173"

# 邮件服务器配置（Gmail示例）
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

## 使用指南

### 注册和登录

1. 访问首页，点击"立即注册"创建新账户
2. 使用邮箱和密码登录系统
3. 如果忘记密码，可以通过"忘记密码"功能重置

### 创建新项目

1. 登录后，点击"新建项目"
2. 填写项目名称和描述
3. 提交后进入项目详情页

### 分析需求

1. 在项目详情页，输入或粘贴需求文档内容
2. 点击"保存需求"按钮保存内容
3. 使用以下功能按钮进行分析：
   - "生成用户故事" - 创建符合敏捷标准的用户故事
   - "生成需求实体" - 分析业务实体及其关系
   - "生成数据库设计" - 创建数据库架构和设计

### 查看结果

生成的内容将显示在各自的选项卡中：
- "用户故事"选项卡显示生成的用户故事
- "实体分析"选项卡显示识别的业务实体
- "数据库设计"选项卡显示推荐的数据库结构

## 项目结构

```
ai-requirements-analyzer/
├── app/                    # 应用代码
│   ├── components/         # UI组件
│   ├── routes/             # 路由定义
│   ├── styles/             # 样式文件
│   └── utils/              # 工具函数
├── prisma/                 # Prisma数据库模型
├── public/                 # 静态资源
├── .env                    # 环境变量
├── package.json            # 项目依赖
└── README.md               # 项目文档
```

## 常见问题

### 邮件发送失败

如果遇到邮件发送失败的问题：
1. 检查SMTP配置是否正确
2. 确认使用了正确的应用密码（对于Gmail）
3. 查看服务器日志中的详细错误信息

### AI生成内容不理想

可以通过以下方式优化AI生成内容：
1. 提供更详细和结构化的需求文档
2. 在保存需求前，确保文档内容清晰且无歧义
3. 多次尝试生成，选择最佳结果

## 许可证

[MIT](LICENSE)

## 联系方式

如有任何问题或建议，请通过以下方式联系我们：
- 电子邮件: leo92816leo92816@gmail.com
- GitHub: [项目仓库](https://github.com/MagicalLeo/Ai-Requirement-Analyzer)
