// app/routes/logout.tsx
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { logout } from "~/utils/auth.server";

// 处理 POST 请求 - 这是执行登出操作的地方
export const action: ActionFunction = async ({ request }) => {
  return logout(request);
};

// 处理 GET 请求 - 如果有人直接访问 /logout 页面
export const loader: LoaderFunction = async () => {
  return redirect("/");
};