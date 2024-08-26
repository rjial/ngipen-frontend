/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/*.css"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
  tailwind: true,
  postcss: true,
  browserNodeBuiltinsPolyfill: {
    modules: {
      path: true,
      url: true,
      zlib: true,
      stream: true
    }
  }
};
