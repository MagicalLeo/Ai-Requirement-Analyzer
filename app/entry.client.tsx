/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */

import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
try {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <RemixBrowser />
      </StrictMode>
    );
  });
} catch (error) {
  console.error("服务器渲染错误:", error);
  throw error;
}

// 在 app/routes/login.tsx 的 action 函数中添加：
// console.log("提交的表单数据:", Object.fromEntries(form.entries())); // Removed or commented out as 'form' is undefined

// 在认证失败时添加：
console.log("登录失败，用户名或密码不正确");

// 在环境变量读取处添加：
console.log("环境变量检查:", {
  DATABASE_URL: process.env.DATABASE_URL ? "已设置" : "未设置",
  SESSION_SECRET: process.env.SESSION_SECRET ? "已设置" : "未设置",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ? "已设置" : "未设置",
});
