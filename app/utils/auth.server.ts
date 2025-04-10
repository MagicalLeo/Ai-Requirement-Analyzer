// app/utils/auth.server.ts
import { redirect } from "@remix-run/node";
import bcrypt from "bcryptjs";
import { db } from "./db.server";
import { getSession, commitSession, destroySession } from "./session.server";
import crypto from 'crypto';
import { sendPasswordResetEmail } from './email.server';

type LoginForm = {
  email: string;
  password: string;
};

export async function register({
  email,
  password,
  name,
}: LoginForm & { name: string }) {
  try {
    // 检查用户是否已存在
    const existingUser = await db.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      throw new Error(`已存在使用 ${email} 的用户`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        name,
      },
    });
    return { id: user.id, email };
  } catch (error) {
    console.error("注册用户时出错:", error);
    throw error;
  }
}

export async function login({ email, password }: LoginForm) {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });
    if (!user) return null;

    const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isCorrectPassword) return null;

    return { id: user.id, email };
  } catch (error) {
    console.error("登录时出错:", error);
    return null;
  }
}

export async function createUserSession(userId: string, redirectTo: string) {
  try {
    // 使用有效的 URL 而不是空字符串
    const session = await getSession(new Request("http://localhost"));
    session.set("userId", userId);
    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    console.error("创建用户会话时出错:", error);
    // 返回重定向，但不设置cookie
    return redirect(redirectTo);
  }
}

export async function getUserId(request: Request) {
  try {
    const session = await getSession(request);
    const userId = session.get("userId");
    if (!userId || typeof userId !== "string") return null;
    return userId;
  } catch (error) {
    console.error("获取用户ID时出错:", error);
    return null;
  }
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  try {
    const session = await getSession(request);
    const userId = session.get("userId");
    if (!userId || typeof userId !== "string") {
      const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
      throw redirect(`/login?${searchParams}`);
    }
    return userId;
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error("requireUserId 错误:", error);
    // 出错时重定向到登录页面
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
}

export async function getUser(request: Request) {
  try {
    const userId = await getUserId(request);
    if (typeof userId !== "string") {
      return null;
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });
    return user;
  } catch (error) {
    console.error("获取用户时出错:", error);
    throw logout(request);
  }
}

export async function logout(request: Request) {
  try {
    const session = await getSession(request);
    
    // 设置明确的 Cookie 过期时间
    return redirect("/", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  } catch (error) {
    console.error("登出时出错:", error);
    // 即使出错，也尝试清除 Cookie 并重定向
    return redirect("/", {
      headers: {
        "Set-Cookie": `ai_requirements_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`,
      },
    });
  }
}


/**
 * 创建密码重置令牌并存储在数据库中
 */
export async function createPasswordResetToken(email: string) {
  const user = await db.user.findUnique({
    where: { email },
  });
  
  if (!user) {
    // 为了安全起见，不透露用户是否存在
    return { success: true };
  }
  
  // 生成令牌
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  // 设置过期时间 (24小时)
  const expires = new Date();
  expires.setHours(expires.getHours() + 24);
  
  // 存储重置令牌
  // 注意：这需要在你的Prisma模型中添加相关字段
  await db.user.update({
    where: { id: user.id },
    data: {
      resetToken: hashedToken,
      resetTokenExpires: expires,
    },
  });
  
  // 构建应用URL
  const appUrl = process.env.APP_URL || 'http://localhost:5173';
  
  // 发送重置邮件
  const result = await sendPasswordResetEmail(email, token, appUrl);
  
  return result;
}

/**
 * 重置用户密码
 */
export async function resetPassword(token: string, newPassword: string) {
  try {
    // 哈希令牌以与存储的值匹配
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    // 查找有效的重置令牌
    const user = await db.user.findFirst({
      where: {
        resetToken: hashedToken,
        resetTokenExpires: {
          gt: new Date(),
        },
      },
    });
    
    if (!user) {
      return { success: false, error: '无效或过期的令牌' };
    }
    
    // 哈希新密码并更新用户
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await db.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    });
    
    return { success: true };
  } catch (error) {
    console.error('密码重置失败:', error);
    return { success: false, error: '密码重置失败' };
  }
}