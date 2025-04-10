// app/routes/projects.$projectId._index.tsx
// 这是需要修改的文件，添加防止重复生成功能

import { useState, useEffect } from "react";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  useOutletContext,
  useActionData,
  Form,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { requireUserId } from "~/utils/auth.server";
import { db } from "~/utils/db.server";
import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import { generateUserStories, generateEntities, generateDatabaseDesign } from "~/utils/openai.server";

type ProjectContext = {
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

type ActionData = {
  formError?: string;
  success?: boolean;
  generatedContent?: {
    userStories?: string;
    entities?: string;
    dbDesign?: string;
  };
  generationType?: string; // 添加这个字段来跟踪生成的类型
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
      let generationType = "";

      if (action === "generateUserStories") {
        generationType = "userStories";
        const userStories = await generateUserStories(requirementText);
        await db.project.update({
          where: { id: projectId },
          data: { userStories },
        });
        generatedContent = { userStories };
      } else if (action === "generateEntities") {
        generationType = "entities";
        const entities = await generateEntities(requirementText);
        await db.project.update({
          where: { id: projectId },
          data: { entities },
        });
        generatedContent = { entities };
      } else if (action === "generateDbDesign") {
        generationType = "dbDesign";
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
        generationType, // 返回生成的类型
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

export default function RequirementsTab() {
  const { project } = useOutletContext<ProjectContext>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const [requirements, setRequirements] = useState(project.requirementDoc || "");
  
  // 跟踪各种生成操作的状态
  const [generationState, setGenerationState] = useState({
    userStories: false,
    entities: false,
    dbDesign: false
  });

  // 当前是否有任何生成操作正在进行
  const isAnyGenerating = Object.values(generationState).some(state => state);
  
  // 检查特定操作是否正在提交
  const isSubmitting = navigation.state === "submitting";
  const isGeneratingUserStories = isSubmitting && navigation.formData?.get("_action") === "generateUserStories";
  const isGeneratingEntities = isSubmitting && navigation.formData?.get("_action") === "generateEntities";
  const isGeneratingDbDesign = isSubmitting && navigation.formData?.get("_action") === "generateDbDesign";
  const isSavingRequirements = isSubmitting && navigation.formData?.get("_action") === "updateRequirements";

  // 当生成操作开始时更新状态
  useEffect(() => {
    if (isGeneratingUserStories) {
      setGenerationState(prev => ({ ...prev, userStories: true }));
    }
    if (isGeneratingEntities) {
      setGenerationState(prev => ({ ...prev, entities: true }));
    }
    if (isGeneratingDbDesign) {
      setGenerationState(prev => ({ ...prev, dbDesign: true }));
    }
  }, [isGeneratingUserStories, isGeneratingEntities, isGeneratingDbDesign]);

  // 当操作完成时重置状态
  useEffect(() => {
    if (actionData?.success && actionData.generationType) {
      // 重置特定的生成状态
      setGenerationState(prev => ({
        ...prev,
        [actionData.generationType as string]: false
      }));
    }
  }, [actionData]);

  // 处理生成按钮点击，使用程序化提交而不是Form组件
  const handleGenerate = (action: string) => {
    // 如果已经有生成操作在进行，则不执行任何操作
    if (isAnyGenerating) return;
    
    const formData = new FormData();
    formData.append("_action", action);
    submit(formData, { method: "post" });
  };

  return (
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
              isLoading={isSavingRequirements}
              disabled={isSavingRequirements}
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
              type="button"
              onClick={() => handleGenerate("generateUserStories")}
              isLoading={isGeneratingUserStories || generationState.userStories}
              disabled={isAnyGenerating}
            >
              {generationState.userStories ? "生成用户故事中..." : "生成用户故事"}
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleGenerate("generateEntities")}
              isLoading={isGeneratingEntities || generationState.entities}
              disabled={isAnyGenerating}
            >
              {generationState.entities ? "生成需求实体中..." : "生成需求实体"}
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleGenerate("generateDbDesign")}
              isLoading={isGeneratingDbDesign || generationState.dbDesign}
              disabled={isAnyGenerating}
            >
              {generationState.dbDesign ? "生成数据库设计中..." : "生成数据库设计"}
            </Button>
          </div>
          
          {isAnyGenerating && !actionData?.formError && (
            <div className="mt-4 rounded-md bg-blue-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg 
                    className="h-5 w-5 text-blue-400 animate-spin" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    ></circle>
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    正在生成内容，请稍候...
                  </h3>
                  <p className="mt-2 text-sm text-blue-700">
                    根据需求文档复杂度，生成过程可能需要几秒到几分钟不等。请勿刷新页面或重复点击按钮。
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {actionData?.success && !isAnyGenerating && (
            <div className="mt-4 rounded-md bg-green-50 p-4">
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
                    生成成功
                  </h3>
                  <p className="mt-2 text-sm text-green-700">
                    {actionData.generationType === 'userStories' && '用户故事已生成，请切换到用户故事选项卡查看。'}
                    {actionData.generationType === 'entities' && '需求实体已生成，请切换到实体分析选项卡查看。'}
                    {actionData.generationType === 'dbDesign' && '数据库设计已生成，请切换到数据库设计选项卡查看。'}
                  </p>
                </div>
              </div>
            </div>
          )}
          
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
}