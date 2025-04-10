// app/routes/reset-password.$token.tsx
import { useState, useEffect } from "react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, Form, useNavigation } from "@remix-run/react";
import { getUserId } from "~/utils/auth.server";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import { FormField } from "~/components/FormField";
import { Card } from "~/components/Card";
import { z } from "zod";
import { resetPassword } from "~/utils/auth.server"; // Import the resetPassword function

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/dashboard");
  return json({});
};

const resetPasswordSchema = z.object({
  password: z.string().min(6, "密码至少需要6个字符"),
  confirmPassword: z.string().min(6, "密码至少需要6个字符"),
}).refine(data => data.password === data.confirmPassword, {
  message: "两次输入的密码不一致",
  path: ["confirmPassword"],
});

type ActionData = {
  formError?: string;
  fieldErrors?: {
    password?: string;
    confirmPassword?: string;
  };
  fields?: {
    password: string;
    confirmPassword: string;
  };
  success?: boolean;
};

export const action: ActionFunction = async ({ request, params }) => {
  const token = params.token;
  if (!token) {
    return json<ActionData>(
      { formError: "重置令牌无效" },
      { status: 400 }
    );
  }

  const form = await request.formData();
  const password = form.get("password");
  const confirmPassword = form.get("confirmPassword");

  if (
    typeof password !== "string" ||
    typeof confirmPassword !== "string"
  ) {
    return json<ActionData>(
      { formError: "表单提交不正确，请重试。" },
      { status: 400 }
    );
  }

  const result = resetPasswordSchema.safeParse({
    password,
    confirmPassword,
  });

  if (!result.success) {
    const fieldErrors = Object.fromEntries(
      Object.entries(result.error.flatten().fieldErrors).map(([key, value]) => [
        key,
        value?.join(", "),
      ])
    );
    return json<ActionData>(
      { 
        fieldErrors, 
        fields: { password, confirmPassword } 
      },
      { status: 400 }
    );
  }

  // 重置密码
  const resetResult = await resetPassword(token, password);
  
  if (!resetResult.success) {
    return json<ActionData>(
      { 
        formError: resetResult.error || "密码重置失败，请尝试重新获取重置链接。", 
        fields: { password, confirmPassword } 
      },
      { status: 400 }
    );
  }

  // 返回成功响应
  return json<ActionData>({ success: true });
};

export default function ResetPassword() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (actionData?.fields) {
      setPassword(actionData.fields.password);
      setConfirmPassword(actionData.fields.confirmPassword);
    }
  }, [actionData]);

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">重置密码</h1>
          <p className="mt-2 text-sm text-gray-600">
            请输入您的新密码
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
                    密码重置成功
                  </h3>
                  <p className="mt-2 text-sm text-green-700">
                    您的密码已成功重置。请使用新密码登录。
                  </p>
                </div>
              </div>
            </div>

            <div>
              <a
                href="/login"
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                返回登录
              </a>
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
                htmlFor="password"
                label="新密码"
                error={actionData?.fieldErrors?.password}
              >
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={Boolean(actionData?.fieldErrors?.password)}
                  aria-errormessage={
                    actionData?.fieldErrors?.password ? "password-error" : undefined
                  }
                  required
                />
              </FormField>

              <FormField
                htmlFor="confirmPassword"
                label="确认新密码"
                error={actionData?.fieldErrors?.confirmPassword}
              >
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  aria-invalid={Boolean(actionData?.fieldErrors?.confirmPassword)}
                  aria-errormessage={
                    actionData?.fieldErrors?.confirmPassword ? "confirmPassword-error" : undefined
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
                  重置密码
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <a
                  href="/login"
                  className="text-sm font-medium text-primary-600 hover:text-primary-500"
                >
                  返回登录
                </a>
              </div>
            </div>
          </Form>
        )}
      </Card>
    </div>
  );
}