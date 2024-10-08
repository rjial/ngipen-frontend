import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  redirect,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import globalStylesheet from "~/globals.css";
import '@fontsource/inter/100.css';
import '@fontsource/inter/200.css';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import { Toaster } from "@/components/ui/toaster";
import { createAuthSession, getAuthSession, getAuthToken, getUserClaim } from "./utils/authUtil";
import { ICheckoutService } from "./service/checkout/ICheckoutService";
import { ExternalScripts } from 'remix-utils/external-scripts'
import { cssBundleHref } from "@remix-run/css-bundle";
import { IAuthService } from "./service/auth/IAuthService.server";
import { destroySession } from "./sessions";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: globalStylesheet },
];

export async function loader({request}: LoaderFunctionArgs) {
  const user = await getUserClaim(request)
  if(user != undefined) {
    const authService = new IAuthService()
    const res = await authService.detail(request)
    if (res.status_code == 401) {
      // try to refresh token
      const token = await getAuthToken(request) || ""
      const refreshRes = await authService.refresh({token: token}, request)
      if (refreshRes.status_code == 200) {
        return await createAuthSession(request, refreshRes.data?.refreshToken!, request.url)
      } else {
        // if not valid then it will logout and redirect to login
        const session = await getAuthSession(request)
        return redirect("/login", {
          headers: {
            "Set-Cookie": await destroySession(session)
          }
        })
      }
    }
  }
  let checkoutCount = 0
  if (user !== undefined) {
    const checkoutService = new ICheckoutService()
    const checkoutRes = await checkoutService.getCheckouts({request})
    checkoutCount = (checkoutRes.data || []).length
  }
  return json({user, checkoutCount})
}

export default function App() {
  const data = useLoaderData<typeof loader>()
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen">
        <Outlet context={data}/>
        <ScrollRestoration />
        <ExternalScripts/>
        <Scripts />
        <LiveReload/>
        <Toaster/>
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body className="w-screen h-screen flex flex-col justify-center items-center space-y-3">
        {/* add the UI you want your users to see */}
        {/* @ts-ignore */}
        <span className="text-4xl font-bold">{error?.status}</span>
        {/* @ts-ignore */}
        <span className="text-xl font-semibold">{error?.data}</span>
        <Scripts />
      </body>
    </html>
  );
}
