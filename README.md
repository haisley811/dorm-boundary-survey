# 你的宿舍边界

一个可部署到 Vercel 的中文问卷网站，用于“大学宿舍私人边界”设计作品集前期调研。技术栈：Next.js App Router、TypeScript、Tailwind CSS、Framer Motion、Supabase、Recharts。

## 本地运行

1. 安装依赖：

```bash
npm install
```

如果你的 npm 里配置过旧代理导致安装卡住，可以临时关闭代理安装：

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
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的 Supabase anon key
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
4. 在 Project Settings / API 里复制 Project URL 和 anon key。
5. 本项目使用服务端 API 写入和读取数据，后台页面再用 `ADMIN_PASSWORD` 做访问保护。

如果你之前已经创建过 `responses` 表，请再运行一次：

```text
supabase/migration-first-response-only.sql
```

它会增加匿名用户编号，并保证同一个浏览器只有第一次提交会计入后台。

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

## 上传 GitHub

```bash
git init
git add .
git commit -m "Initial dorm boundary survey"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

## 部署到 Vercel

1. 在 Vercel 导入 GitHub 仓库。
2. Framework Preset 选择 Next.js。
3. 添加环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_PASSWORD`
4. 点击 Deploy。

部署后先完成一次问卷，再访问 `/admin` 检查统计是否出现。

## 部署后获取公开链接与更新网站

Vercel 部署完成后会生成一个公开链接，通常形如：

```text
https://你的项目名.vercel.app
```

你也可以在 Vercel 项目页面的 Domains 里绑定自己的域名。

后续更新网站：

```bash
git add .
git commit -m "Update survey site"
git push
```

推送到 GitHub 后，Vercel 会自动重新部署。部署完成后刷新公开链接即可看到新版本。
