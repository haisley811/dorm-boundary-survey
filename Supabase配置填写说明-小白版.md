# Supabase 配置填写说明

你的网站要把问卷数据保存到 Supabase，需要在项目文件夹里放一个叫 `.env.local` 的文件。

项目文件夹是：

```text
D:\文档\college boundaries
```

## 文件名必须完全正确

正确文件名：

```text
.env.local
```

错误文件名：

```text
.env.local.txt
.env.example
env.local
```

如果文件名后面多了 `.txt`，网站读不到。

## 正确填写格式

请复制下面这个格式：

```text
NEXT_PUBLIC_SUPABASE_URL=这里粘贴你的Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=这里粘贴你的Publishable key
ADMIN_PASSWORD=这里写你自己设置的后台密码
```

注意：

- `NEXT_PUBLIC_SUPABASE_URL` 中间必须有下划线 `_`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` 中间必须有下划线 `_`
- `ADMIN_PASSWORD` 中间必须有下划线 `_`
- 等号 `=` 左右不要加空格

## URL 应该长什么样

URL 应该类似：

```text
https://xxxxxxxxxxxx.supabase.co
```

不要带：

```text
/rest/v1/
```

错误例子：

```text
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co/rest/v1/
```

正确例子：

```text
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
```

## Key 应该用哪个

使用 Supabase 里的：

```text
Publishable key
```

它通常长这样：

```text
sb_publishable_xxxxxxxxxxxxxxxxx
```

不要用：

```text
Secret key
```

也不要用：

```text
sb_secret_...
```

## 修改后要做什么

保存 `.env.local` 后：

1. 关闭所有黑色启动窗口
2. 重新双击 `start-local-site.cmd`
3. 等它显示 `Ready`
4. 再刷新浏览器
