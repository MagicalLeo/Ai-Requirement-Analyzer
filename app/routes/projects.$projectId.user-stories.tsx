import { useOutletContext } from "@remix-run/react";
import { Card } from "~/components/Card";
import { Link } from "@remix-run/react";

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

export default function UserStoriesTab() {
  const { project } = useOutletContext<ProjectContext>();

  return (
    <Card>
      {project.userStories ? (
        <div className="prose prose-sm max-w-none">
          <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md">
            {project.userStories}
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">还没有用户故事</h3>
          <p className="mt-1 text-sm text-gray-500">在需求文档选项卡中生成用户故事。</p>
          <Link
            to={`/projects/${project.id}`}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            返回需求文档
          </Link>
        </div>
      )}
    </Card>
  );
}
