// app/routes/projects.$projectId.tsx
import { useState, useEffect } from "react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  useLoaderData,
  useActionData,
  Form,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { requireUserId } from "~/utils/auth.server";
import { db } from "~/utils/db.server";
import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import clsx from "clsx";
import { generateUserStories, generateEntities, generateDatabaseDesign } from "~/utils/openai.server";

type LoaderData = {
  project: {
    id: string;
    name: string;
    description: string | null;
    requirementDoc: string | null;
    userStories: string | null;
    entities: string | null;
    dbDesign: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const { projectId } = params;

  if (!projectId) {
    return redirect("/dashboard");
  }

  const project = await db.project.findFirst({
    where: { id: projectId, userId },
  });

  if (!project) {
    throw new Response("项目不存在", { status: 404 });
  }

  return json<LoaderData>({
    project: {
      ...project,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    },
  });
};

type ActionData = {
  formError?: string;
  success?: boolean;
  generatedContent?: {
    userStories?: string;
    entities?: string;
    dbDesign?: string;
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const { projectId } = params;

  if (!projectId) {
    return json<ActionData>(
      { formError: "项目ID不存在" },
      { status: 400 }
    );
  }

  const project = await db.project.findFirst({
    where: { id: projectId, userId },
  });

  if (!project) {
    return json<ActionData>(
      { formError: "项目不存在" },
      { status: 404 }
    );
  }

  const form = await request.formData();
  const action = form.get("_action");

  // 如果是上传或更新需求文档
  if (action === "updateRequirements") {
    const requirementDoc = form.get("requirementDoc");
    
    if (typeof requirementDoc !== "string") {
      return json<ActionData>(
        { formError: "需求文档内容必须是文本" },
        { status: 400 }
      );
    }

    await db.project.update({
      where: { id: projectId },
      data: { requirementDoc },
    });

    return json<ActionData>({ success: true });
  }

  // 如果是生成用户故事、实体或数据库设计
  if (
    action === "generateUserStories" ||
    action === "generateEntities" ||
    action === "generateDbDesign"
  ) {
    if (!project.requirementDoc) {
      return json<ActionData>(
        { formError: "请先提供需求文档" },
        { status: 400 }
      );
    }

    try {
      let generatedContent = {};
      const requirementText = project.requirementDoc;

      if (action === "generateUserStories") {
        const userStories = await generateUserStories(requirementText);
        await db.project.update({
          where: { id: projectId },
          data: { userStories },
        });
        generatedContent = { userStories };
      } else if (action === "generateEntities") {
        const entities = await generateEntities(requirementText);
        await db.project.update({
          where: { id: projectId },
          data: { entities },
        });
        generatedContent = { entities };
      } else if (action === "generateDbDesign") {
        const dbDesign = await generateDatabaseDesign(requirementText);
        await db.project.update({
          where: { id: projectId },
          data: { dbDesign },
        });
        generatedContent = { dbDesign };
      }

      return json<ActionData>({
        success: true,
        generatedContent,
      });
    } catch (error) {
      console.error("生成内容时出错:", error);
      return json<ActionData>(
        {
          formError: "生成内容时出错，请重试",
        },
        { status: 500 }
      );
    }
  }

  return json<ActionData>(
    { formError: "未知操作" },
    { status: 400 }
  );
};

export default function ProjectDetail() {
  const { project } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [requirements, setRequirements] = useState(project.requirementDoc || "");
  const [activeTab, setActiveTab] = useState(0);
  const submit = useSubmit();

  // 确保当项目数据更新时，需求文档状态也更新
  useEffect(() => {
    setRequirements(project.requirementDoc || "");
  }, [project.requirementDoc]);

  // 当需要从"返回需求文档"按钮返回时，这个函数会被调用
  const navigateToTab = (tabIndex: number): void => {
    setActiveTab(tabIndex);
  };

  // 生成内容的逻辑整合到一个函数中
  type GenerateActionType = "generateUserStories" | "generateEntities" | "generateDbDesign";

  const handleGenerate = (type: GenerateActionType): void => {
    const formData = new FormData();
    formData.append("_action", type);
    submit(formData, { method: "post" });
  };

  // 定义标签内容
  const tabs = [
    { name: "需求文档", key: "requirements" },
    { name: "用户故事", key: "userStories" },
    { name: "实体分析", key: "entities" },
    { name: "数据库设计", key: "dbDesign" },
  ];

  // 需求文档面板
  const RequirementsTab = () => (
    <Card>
      <Form method="post">
        <input type="hidden" name="_action" value="updateRequirements" />
        <div className="space-y-4">
          <div>
            <label
              htmlFor="requirementDoc"
              className="block text-sm font-medium text-gray-700"
            >
              需求文档
            </label>
            <div className="mt-1">
              <textarea
                id="requirementDoc"
                name="requirementDoc"
                rows={15}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="在此输入或粘贴需求文档内容..."
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              请详细描述您的系统需求，包括功能点、用户角色、业务规则等，越详细越好。
            </p>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              isLoading={isSubmitting && navigation.formData?.get("_action") === "updateRequirements"}
            >
              保存需求
            </Button>
          </div>
        </div>
      </Form>
      
      {project.requirementDoc && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            生成分析内容
          </h3>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => handleGenerate("generateUserStories")}
              isLoading={isSubmitting && navigation.formData?.get("_action") === "generateUserStories"}
            >
              生成用户故事
            </Button>
            
            <Button
              onClick={() => handleGenerate("generateEntities")}
              variant="secondary"
              isLoading={isSubmitting && navigation.formData?.get("_action") === "generateEntities"}
            >
              生成需求实体
            </Button>
            
            <Button
              onClick={() => handleGenerate("generateDbDesign")}
              variant="secondary"
              isLoading={isSubmitting && navigation.formData?.get("_action") === "generateDbDesign"}
            >
              生成数据库设计
            </Button>
          </div>
          
          {actionData?.formError && (
            <div className="mt-4 rounded-md bg-red-50 p-4">
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
          )}
        </div>
      )}
    </Card>
  );

  // 内容面板的通用组件的接口定义
  interface ContentPanelProps {
    content: string | null;
    title: string;
    navigateToRequirements: () => void;
  }

  // 内容面板的通用组件
  
  // eslint-disable-next-line react/prop-types
  const ContentPanel: React.FC<ContentPanelProps> = ({ content, title, navigateToRequirements }) => (
    <Card>
      {content ? (
        <div className="prose prose-sm max-w-none">
          <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md">
            {content}
          </pre>
        </div>
      ) : (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">还没有{title}</h3>
          <p className="mt-1 text-sm text-gray-500">在需求文档选项卡中生成{title}。</p>
          <Button
            onClick={navigateToRequirements}
            className="mt-4"
          >
            返回需求文档
          </Button>
        </div>
      )}
    </Card>
  );

  // 渲染当前活动标签内容
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 0:
        return <RequirementsTab />;
      case 1:
        return (
          <ContentPanel 
            content={project.userStories} 
            title="用户故事" 
            navigateToRequirements={() => navigateToTab(0)} 
          />
        );
      case 2:
        return (
          <ContentPanel 
            content={project.entities} 
            title="实体分析" 
            navigateToRequirements={() => navigateToTab(0)} 
          />
        );
      case 3:
        return (
          <ContentPanel 
            content={project.dbDesign} 
            title="数据库设计" 
            navigateToRequirements={() => navigateToTab(0)} 
          />
        );
      default:
        return <RequirementsTab />;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
        {project.description && (
          <p className="mt-1 text-gray-500">{project.description}</p>
        )}
      </div>

      <div>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab, index) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => navigateToTab(index)}
                className={clsx(
                  "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none",
                  activeTab === index
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
                data-tab-index={index}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-4">
          {renderActiveTabContent()}
        </div>
      </div>
    </div>
  );
}