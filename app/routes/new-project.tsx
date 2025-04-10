import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, Form, useNavigation } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/auth.server";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import { FormField } from "~/components/FormField";
import { Card } from "~/components/Card";
import { z } from "zod";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  return json({});
};

const projectSchema = z.object({
  name: z.string().min(1, "项目名称不能为空"),
  description: z.string().optional(),
});

type ActionData = {
  formError?: string;
  fieldErrors?: {
    name?: string;
    description?: string;
  };
  fields?: {
    name: string;
    description: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  const name = form.get("name");
  const description = form.get("description");

  if (
    typeof name !== "string" ||
    (description !== null && typeof description !== "string")
  ) {
    return json<ActionData>(
      { formError: "表单提交不正确，请重试。" },
      { status: 400 }
    );
  }

  const result = projectSchema.safeParse({
    name,
    description,
  });

  if (!result.success) {
    const fieldErrors = {
      name: result.error.flatten().fieldErrors.name?.join(", "),
      description: result.error.flatten().fieldErrors.description?.join(", "),
    };
    return json<ActionData>(
      { fieldErrors, fields: { name, description: description ?? "" } },
      { status: 400 }
    );
  }

  const project = await db.project.create({
    data: {
      name,
      description,
      userId,
    },
  });

  return redirect(`/projects/${project.id}`);
};

export default function NewProject() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isCreating = navigation.state === "submitting";

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">创建新项目</h1>
        <p className="mt-1 text-sm text-gray-500">
          创建一个新项目以开始使用AI需求分析。填写项目基本信息，后续您可以上传需求文档或直接输入需求内容。
        </p>
      </div>

      <Card>
        <Form method="post" className="space-y-6">
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
            label="项目名称"
            error={actionData?.fieldErrors?.name}
          >
            <Input
              id="name"
              name="name"
              defaultValue={actionData?.fields?.name || ""}
              aria-invalid={Boolean(actionData?.fieldErrors?.name)}
              aria-errormessage={
                actionData?.fieldErrors?.name ? "name-error" : undefined
              }
              required
            />
          </FormField>

          <FormField
            htmlFor="description"
            label="项目描述（可选）"
            error={actionData?.fieldErrors?.description}
          >
            <textarea
              id="description"
              name="description"
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              defaultValue={actionData?.fields?.description || ""}
              aria-invalid={Boolean(actionData?.fieldErrors?.description)}
              aria-errormessage={
                actionData?.fieldErrors?.description
                  ? "description-error"
                  : undefined
              }
            />
          </FormField>

          <div className="flex justify-end">
            <Button type="submit" isLoading={isCreating}>
              创建项目
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}