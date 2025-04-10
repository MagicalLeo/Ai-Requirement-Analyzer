// app/routes/register-simple.tsx
import { useState } from "react";
import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import bcrypt from "bcryptjs";

type ActionData = {
  formError?: string;
  fields?: {
    email: string;
    password: string;
    name: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const form = await request.formData();
    const email = form.get("email");
    const password = form.get("password");
    const name = form.get("name");

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof name !== "string"
    ) {
      return json<ActionData>(
        { formError: "表单提交不正确，请重试。" },
        { status: 400 }
      );
    }

    // 检查用户是否已存在
    const existingUser = await db.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return json<ActionData>(
        { 
          formError: "该电子邮箱已被注册", 
          fields: { email, password, name } 
        },
        { status: 400 }
      );
    }

    // 创建新用户
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        name,
      },
    });

    // 简单重定向到登录页面
    return redirect("/login?registered=true");
  } catch (error) {
    console.error("注册过程中出错:", error);
    return json<ActionData>(
      { formError: "注册过程中出现错误，请重试。" },
      { status: 500 }
    );
  }
};

export default function RegisterSimple() {
  const actionData = useActionData<ActionData>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="mx-auto max-w-md p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">创建新账户 (简单版)</h1>
        <p className="mt-2 text-sm text-gray-600">
          已有账户？ <a href="/login" className="text-blue-600 hover:underline">登录</a>
        </p>
      </div>

      <Form method="post" onSubmit={() => setIsSubmitting(true)}>
        <div className="space-y-4">
          {actionData?.formError ? (
            <div className="p-3 bg-red-100 text-red-800 rounded-md">
              {actionData.formError}
            </div>
          ) : null}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              姓名
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              defaultValue={actionData?.fields?.name || ""}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              电子邮箱
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              defaultValue={actionData?.fields?.email || ""}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              密码
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              defaultValue={actionData?.fields?.password || ""}
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? "提交中..." : "注册"}
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
}