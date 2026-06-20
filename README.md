# 你的宿舍边界

一个可部署的中文问卷网站，用于收集关于“大学宿舍私人边界”的匿名回答。技术栈：Next.js App Router、TypeScript、Tailwind CSS、Framer Motion、Supabase、Recharts。

## 本地运行

1. 安装依赖：

```bash
npm install
```

如果 npm 因网络或代理问题卡住，可以临时使用：

```bash
npm install --registry=https://registry.npmjs.org/ --proxy=null --https-proxy=null
```

2. 复制环境变量：

```bash
cp .env.example .env.local
```

3. 在 `.env.local` 填入：

```bash
NEXT_PUBLIC_SUPABASE_URL=你的 Supabase Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的 Supabase publishable key
ADMIN_PASSWORD=后台访问密码
```

4. 启动：

```bash
npm run dev
```

访问 `http://localhost:3000`。

## Supabase 配置

1. 新建 Supabase 项目。
2. 打开 SQL Editor。
3. 复制并运行 `supabase/schema.sql`。
4. 在 Project Settings / API 或 Data API 里复制 Project URL 和 Publishable key。
5. 本项目使用 Supabase 保存匿名问卷数据，后台页面使用 `ADMIN_PASSWORD` 做简单访问保护。

如果之前已经创建过 `responses` 表，请再运行：

```text
supabase/migration-first-response-only.sql
```

它会增加匿名用户编号，并保证同一个浏览器只有第一次提交计入后台。

## 页面

- `/` 首页
- `/survey` 一题一屏问卷
- `/result` 结果画像页
- `/admin` 密码保护后台
- `/api/export` CSV 导出接口

## 修改题目与结果

- 题目：`src/data/questions.ts`
- 结果类型：`src/data/resultTypes.ts`
- 结果算法：`src/lib/calculateResult.ts`
