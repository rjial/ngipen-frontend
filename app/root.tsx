import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import globalStylesheet from "~/globals.css?url";
import '@fontsource-variable/inter/wght.css';
import { Toaster } from "@/components/ui/toaster";
import { getUserClaim } from "./utils/authUtil";
import { ICheckoutService } from "./service/checkout/ICheckoutService";
import { ExternalScripts } from 'remix-utils/external-scripts'

export const links: LinksFunction = () => [
  // ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: globalStylesheet },
];

export async function loader({request}: LoaderFunctionArgs) {
  const user = await getUserClaim(request)
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
      <body>
        <Outlet context={data}/>
        <ScrollRestoration />
        <ExternalScripts/>
        <Scripts />
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
