// app/routes/forgot-password.tsx
import { useState, useEffect } from "react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, Link, Form, useNavigation } from "@remix-run/react";
import { getUserId, createPasswordResetToken } from "~/utils/auth.server";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import { FormField } from "~/components/FormField";
import { Card } from "~/components/Card";
import { z } from "zod";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/dashboard");
  return json({});
};

const forgotPasswordSchema = z.object({
  email: z.string().email("请输入有效的电子邮箱"),
});

type ActionData = {
  formError?: string;
  fieldErrors?: {
    email?: string;
  };
  fields?: {
    email: string;
  };
  success?: boolean;
  previewUrl?: string; // 开发环境中的邮件预览URL
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const email = form.get("email");

  if (typeof email !== "string") {
    return json<ActionData>(
      { formError: "表单提交不正确，请重试。" },
      { status: 400 }
    );
  }

  const result = forgotPasswordSchema.safeParse({ email });

  if (!result.success) {
    const fieldErrors = Object.fromEntries(
      Object.entries(result.error.flatten().fieldErrors).map(([key, value]) => [
        key,
        value?.join(", "),
      ])
    );
    return json<ActionData>(
      { fieldErrors, fields: { email } },
      { status: 400 }
    );
  }

  // 创建密码重置令牌并发送邮件
  const resetResult = await createPasswordResetToken(email);
  
  if (!resetResult.success) {
    return json<ActionData>(
      { 
        formError: "发送重置邮件失败，请稍后重试。", 
        fields: { email } 
      },
      { status: 500 }
    );
  }

  // 返回成功响应，包括开发环境中的邮件预览URL
  return json<ActionData>({
    success: true,
    fields: { email },
    previewUrl: "previewUrl" in resetResult && resetResult.previewUrl ? resetResult.previewUrl : undefined,
  });
};

export default function ForgotPassword() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (actionData?.fields?.email) {
      setEmail(actionData.fields.email);
    }
  }, [actionData]);

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">忘记密码</h1>
          <p className="mt-2 text-sm text-gray-600">
            输入您的电子邮箱，我们将向您发送重置密码的链接。
          </p>
        </div>

        {actionData?.success ? (
          <div className="space-y-4">
            <div className="rounded-md bg-green-50 p-4">
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
                    密码重置链接已发送
                  </h3>
                  <p className="mt-2 text-sm text-green-700">
                    我们已向 {email} 发送了一封包含密码重置链接的邮件。请检查您的收件箱。
                  </p>
                  {actionData.previewUrl && (
                    <div className="mt-2">
                      <a
                        href={actionData.previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:text-primary-500"
                      >
                        [开发模式] 查看邮件预览
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link
                to="/login"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                返回登录
              </Link>
            </div>
          </div>
        ) : (
          <Form method="post" noValidate>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={Boolean(actionData?.fieldErrors?.email)}
                  aria-errormessage={
                    actionData?.fieldErrors?.email ? "email-error" : undefined
                  }
                  required
                />
              </FormField>

              <div>
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isSubmitting}
                >
                  发送重置链接
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  to="/login"
                  className="text-sm font-medium text-primary-600 hover:text-primary-500"
                >
                  返回登录
                </Link>
              </div>
            </div>
          </Form>
        )}
      </Card>
    </div>
  );
}