// app/utils/session.server.ts
import { createCookieSessionStorage, Session } from "@remix-run/node";

// 使用备用密钥确保即使环境变量未设置应用也能启动
const sessionSecret = process.env.SESSION_SECRET || "fallback-dev-secret-do-not-use-in-production";

if (!process.env.SESSION_SECRET) {
  console.warn(
    "⚠️ 警告: SESSION_SECRET 环境变量未设置，正在使用不安全的备用密钥！"
  );
}

// 创建会话存储
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "ai_requirements_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
  },
});

// 创建会话 - 从请求中获取会话
export async function getSession(request: Request) {
  try {
    // 安全地从请求中获取 Cookie
    const cookie = request && request.headers ? request.headers.get("Cookie") : null;
    return sessionStorage.getSession(cookie);
  } catch (error) {
    console.error("获取会话时出错:", error);
    // 返回一个新的空会话而不是抛出错误
    return sessionStorage.getSession();
  }
}

// 提交会话 - 将会话数据保存到 cookie
export async function commitSession(session: Session): Promise<string> {
    return sessionStorage.commitSession(session);
}

// 销毁会话
export async function destroySession(session: Session): Promise<string> {
    return sessionStorage.destroySession(session);
}