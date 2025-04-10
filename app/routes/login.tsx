// app/routes/login.tsx
import { useState, useEffect } from "react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useSearchParams, Link, Form } from "@remix-run/react";
import { login, createUserSession, getUserId } from "~/utils/auth.server";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import { FormField } from "~/components/FormField";
import { Card } from "~/components/Card";
import { z } from "zod";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/dashboard");
  
  // 检查是否从重置密码页面重定向过来
  const url = new URL(request.url);
  const justReset = url.searchParams.get("reset") === "success";
  
  return json({ justReset });
};

const loginSchema = z.object({
  email: z.string().email("请输入有效的电子邮箱"),
  password: z.string().min(6, "密码至少需要6个字符"),
  redirectTo: z.string().default("/dashboard"),
});

type ActionData = {
  formError?: string;
  fieldErrors?: {
    email?: string;
    password?: string;
  };
  fields?: {
    email: string;
    password: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");
  const redirectTo = form.get("redirectTo") || "/dashboard";

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return json<ActionData>(
      { formError: "表单提交不正确，请重试。" },
      { status: 400 }
    );
  }

  const result = loginSchema.safeParse({
    email,
    password,
    redirectTo,
  });

  if (!result.success) {
    const fieldErrors = Object.fromEntries(
      Object.entries(result.error.flatten().fieldErrors).map(([key, value]) => [
        key,
        value?.join(", "),
      ])
    );
    return json<ActionData>(
      { fieldErrors, fields: { email, password } },
      { status: 400 }
    );
  }

  const user = await login({ email, password });
  if (!user) {
    return json<ActionData>(
      { formError: "邮箱或密码不正确", fields: { email, password } },
      { status: 400 }
    );
  }

  return createUserSession(user.id, redirectTo);
};

export default function Login() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsSubmitting(false);
  }, [actionData]);

  // 检查是否有从重置密码页面传来的成功消息
  const justReset = searchParams.get("reset") === "success";

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">登录您的账户</h1>
          <p className="mt-2 text-sm text-gray-600">
            还没有账户？{" "}
            <Link
              to={{
                pathname: "/register",
                search: searchParams.toString(),
              }}
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              立即注册
            </Link>
          </p>
        </div>

        {justReset && (
          <div className="mb-4 rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  密码已重置
                </h3>
                <p className="mt-2 text-sm text-green-700">
                  您的密码已成功重置，现在可以使用新密码登录。
                </p>
              </div>
            </div>
          </div>
        )}

        <Form method="post" noValidate onSubmit={() => setIsSubmitting(true)}>
          <input
            type="hidden"
            name="redirectTo"
            value={searchParams.get("redirectTo") ?? "/dashboard"}
          />

          <div className="space-y-4">
            {actionData?.formError ? (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {actionData.formError}
                    </h3>
                  </div>
                </div>
              </div>
            ) : null}

            <FormField
              htmlFor="email"
              label="电子邮箱"
              error={actionData?.fieldErrors?.email}
            >
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                defaultValue={actionData?.fields?.email || ""}
                aria-invalid={Boolean(actionData?.fieldErrors?.email)}
                aria-errormessage={
                  actionData?.fieldErrors?.email ? "email-error" : undefined
                }
                required
              />
            </FormField>

            <FormField
              htmlFor="password"
              label="密码"
              error={actionData?.fieldErrors?.password}
            >
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                defaultValue={actionData?.fields?.password || ""}
                aria-invalid={Boolean(actionData?.fieldErrors?.password)}
                aria-errormessage={
                  actionData?.fieldErrors?.password
                    ? "password-error"
                    : undefined
                }
                required
              />
            </FormField>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  记住我
                </label>
              </div>
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  忘记密码？
                </Link>
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                登录
              </Button>
            </div>
          </div>
        </Form>
      </Card>
    </div>
  );
}