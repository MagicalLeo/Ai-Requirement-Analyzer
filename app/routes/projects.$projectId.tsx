import { json, redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { 
  Outlet, 
  useLoaderData, 
  NavLink
} from "@remix-run/react";
import { requireUserId } from "~/utils/auth.server";
import { db } from "~/utils/db.server";
import clsx from "clsx";

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
  
  export default function ProjectLayout() {
    const { project } = useLoaderData<LoaderData>();
  
    const tabs = [
      { name: "需求文档", path: "" },
      { name: "用户故事", path: "user-stories" },
      { name: "实体分析", path: "entities" },
      { name: "数据库设计", path: "db-design" },
    ];
  
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
              {tabs.map((tab) => {
                // 构建完整路径，默认选项卡（需求文档）使用父路径
                const tabPath = tab.path 
                  ? `/projects/${project.id}/${tab.path}` 
                  : `/projects/${project.id}`;
                
                return (
                  <NavLink
                    key={tab.name}
                    to={tabPath}
                    className={({ isActive }) => clsx(
                      "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none",
                      isActive
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    )}
                    end={tab.path === ""} // 确保父路径只在完全匹配时激活
                  >
                    {tab.name}
                  </NavLink>
                );
              })}
            </nav>
          </div>
  
          <div className="mt-4">
            {/* 子路由内容将在这里渲染 */}
            <Outlet context={{ project }} />
          </div>
        </div>
      </div>
    );
  }