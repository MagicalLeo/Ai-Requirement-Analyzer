// app/components/Navbar.tsx
import { Link, useLocation, Form } from "@remix-run/react";
import { Button } from "./Button";

interface NavbarProps {
  user: { name?: string | null; email: string } | null;
}

export function Navbar({ user }: NavbarProps) {
  const location = useLocation();
  
  return (
    <nav className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link to="/" className="text-xl font-bold text-primary-600">
                AI需求分析师
              </Link>
            </div>
            {user && (
              <div className="ml-6 flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className={
                    location.pathname === "/dashboard"
                      ? "bg-primary-100 text-primary-700 px-3 py-2 text-sm font-medium rounded-md"
                      : "text-gray-700 hover:bg-gray-100 px-3 py-2 text-sm font-medium rounded-md"
                  }
                >
                  项目
                </Link>
                <Link
                  to="/new-project"
                  className={
                    location.pathname === "/new-project"
                      ? "bg-primary-100 text-primary-700 px-3 py-2 text-sm font-medium rounded-md"
                      : "text-gray-700 hover:bg-gray-100 px-3 py-2 text-sm font-medium rounded-md"
                  }
                >
                  新建项目
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-4">
                  {user.name || user.email}
                </span>
                {/* 这是关键部分：使用 Form 而不是普通 form，并确保 method 是 "post" */}
                <Form action="/logout" method="post">
                  <Button type="submit" variant="outline" size="sm">
                    退出
                  </Button>
                </Form>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className={
                    location.pathname === "/login"
                      ? "bg-primary-100 text-primary-700 px-3 py-2 text-sm font-medium rounded-md"
                      : "text-gray-700 hover:bg-gray-100 px-3 py-2 text-sm font-medium rounded-md"
                  }
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="rounded-md bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700"
                >
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}