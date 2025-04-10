/** @type {import('@remix-run/dev').AppConfig} */
export default {
    ignoredRouteFiles: ["**/.*"],
    serverDependenciesToBundle: [/^remix-utils.*/, "zod"], // 确保打包 zod
    tailwind: true,
    devServerBroadcastDelay: 1000,
    future: {
      v2_routeConvention: true,
      v2_errorBoundary: true,
      v2_normalizeFormMethod: true,
      v2_meta: true,
    },
  };