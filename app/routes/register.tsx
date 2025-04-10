// app/routes/register.tsx
import { useState, useEffect } from "react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useSearchParams, Link, Form } from "@remix-run/react";
import { register, createUserSession, getUserId } from "~/utils/auth.server";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import { FormField } from "~/components/FormField";
import { Card } from "~/components/Card";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/dashboard");
  return json({});
};

// 简单的验证函数，替代 zod
const validateEmail = (email: string) => {
  if (!email || !email.includes('@')) return "请输入有效的电子邮箱";
  return null;
};

const validatePassword = (password: string) => {
  if (!password || password.length < 6) return "密码至少需要6个字符";
  return null;
};

const validateName = (name: string) => {
  if (!name || name.length < 2) return "名称至少需要2个字符";
  return null;
};

type ActionData = {
  formError?: string;
  fieldErrors?: {
    email?: string | null;
    password?: string | null;
    name?: string | null;
  };
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
    const redirectTo = form.get("redirectTo") || "/dashboard";

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof name !== "string" ||
      typeof redirectTo !== "string"
    ) {
      return json<ActionData>(
        { formError: "表单提交不正确，请重试。" },
        { status: 400 }
      );
    }

    // 手动验证
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const nameError = validateName(name);
    
    if (emailError || passwordError || nameError) {
      return json<ActionData>(
        { 
          fieldErrors: { email: emailError, password: passwordError, name: nameError }, 
          fields: { email, password, name } 
        },
        { status: 400 }
      );
    }

    try {
      const user = await register({ email, password, name });
      return createUserSession(user.id, redirectTo);
    } catch (error) {
      if (error instanceof Error && error.message.includes("已存在")) {
        return json<ActionData>(
          { formError: "该电子邮箱已被注册", fields: { email, password, name } },
          { status: 400 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("注册过程中出错:", error);
    return json<ActionData>(
      { formError: "注册过程中出现错误，请重试。" },
      { status: 500 }
    );
  }
};

export default function Register() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsSubmitting(false);
  }, [actionData]);

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">创建新账户</h1>
          <p className="mt-2 text-sm text-gray-600">
            已有账户？{" "}
            <Link
              to={{
                pathname: "/login",
                search: searchParams.toString(),
              }}
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              登录
            </Link>
          </p>
        </div>

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
              htmlFor="name"
              label="姓名"
              error={actionData?.fieldErrors?.name || undefined}
            >
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                defaultValue={actionData?.fields?.name || ""}
                aria-invalid={Boolean(actionData?.fieldErrors?.name)}
                required
              />
            </FormField>

            <FormField
              htmlFor="email"
              label="电子邮箱"
              error={actionData?.fieldErrors?.email || undefined}
            >
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                defaultValue={actionData?.fields?.email || ""}
                aria-invalid={Boolean(actionData?.fieldErrors?.email)}
                required
              />
            </FormField>

            <FormField
              htmlFor="password"
              label="密码"
              error={actionData?.fieldErrors?.password || undefined}
            >
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                defaultValue={actionData?.fields?.password || ""}
                aria-invalid={Boolean(actionData?.fieldErrors?.password)}
                required
              />
            </FormField>

            <div>
              <Button
                type="submit"
                className="w-full"
                isLoading={isSubmitting}
              >
                注册
              </Button>
            </div>
          </div>
        </Form>
      </Card>
    </div>
  );
}