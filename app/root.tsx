// app/root.tsx
import { cssBundleHref } from "@remix-run/css-bundle";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  json,
  useLocation,
  useSearchParams,
} from "@remix-run/react";
import { useEffect } from "react";
import "~/styles/tailwind.css"
import { Toaster } from "react-hot-toast";
import { getUser } from "./utils/auth.server";
import { Navbar } from "~/components/Navbar";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";

export const links: LinksFunction = () => [
  // { rel: "stylesheet", href: styles }, // Removed as 'styles' is undefined
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  {
    rel: "stylesheet",
    href: "https://rsms.me/inter/inter.css",
  },
];

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  return json({ user });
};

export default function App() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { user } = useLoaderData<{ user: any }>();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // 在路由變化時保持搜索參數
  useEffect(() => {
    const currentTab = searchParams.get("tab");
    if (currentTab) {
      window.history.replaceState(
        null,
        "",
        `${location.pathname}?tab=${currentTab}`
      );
    }
  }, [location.pathname, searchParams]);

  return (
    <html lang="zh-CN" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-gray-50">
        <Navbar user={user} />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
        <Toaster position="top-right" />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

// 错误处理
export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  
  return (
    <html lang="zh-CN" className="h-full">
      <head>
        <title>出错了！</title>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <div className="min-h-full bg-white px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
          <div className="mx-auto max-w-max">
            <main className="sm:flex">
              <p className="text-4xl font-bold tracking-tight text-primary-600 sm:text-5xl">500</p>
              <div className="sm:ml-6">
                <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">出错了</h1>
                  <p className="mt-1 text-base text-gray-500">请稍后再试，或联系管理员。</p>
                </div>
                <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                  <a
                    href="/"
                    className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    返回首页
                  </a>
                </div>
              </div>
            </main>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

// 404错误页面
export function CatchBoundary() {
  return (
    <html lang="zh-CN" className="h-full">
      <head>
        <title>页面不存在</title>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <div className="min-h-full bg-white px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
          <div className="mx-auto max-w-max">
            <main className="sm:flex">
              <p className="text-4xl font-bold tracking-tight text-primary-600 sm:text-5xl">404</p>
              <div className="sm:ml-6">
                <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">页面不存在</h1>
                  <p className="mt-1 text-base text-gray-500">请检查您输入的URL是否正确。</p>
                </div>
                <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                  <a
                    href="/"
                    className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    返回首页
                  </a>
                </div>
              </div>
            </main>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}