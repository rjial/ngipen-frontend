import { Button } from "@/components/ui/button"
import { CollapsibleTrigger, CollapsibleContent, Collapsible } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu"
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet"
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Link, NavLink, Outlet, isRouteErrorResponse, useOutletContext, useRouteError } from "@remix-run/react"
import { PropsWithChildren, useState } from "react"
import { NavBar, NavbarUser } from "~/components/common/Navbar"
import { UserClaim } from "~/data/entity/auth/UserClaim"
import { cn } from "@/lib/utils"
import { Bell, ChevronRight, Home, Menu, Package, Package2, Search, Settings, ShoppingCart, User } from "lucide-react"
import { DashboardHeader, DashboardMenu, useDashboardMobileSheet } from "~/components/dashboard/Dashboard"



export default function DashboardLayout() {
    const { handleSheet, DashboardMobileSheet } = useDashboardMobileSheet()
    const {user} = useOutletContext<{user: UserClaim | undefined}>()
    return (
        <div className="grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-[60px] items-center border-b px-6">
                        <Link className="flex items-center gap-2 font-semibold" to="#">
                            <span className="">Ngipen</span>
                        </Link>
                        <Button className="ml-auto h-8 w-8" size="icon" variant="outline">
                            <Bell className="h-4 w-4" />
                            <span className="sr-only">Toggle notifications</span>
                        </Button>
                    </div>
                    <DashboardMenu />
                </div>
            </div>
            <div className="flex flex-col">
                <DashboardHeader handleSheet={handleSheet} />
                <DashboardMobileSheet />
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                    <Outlet context={{user}} />
                </main>
            </div>
        </div>
    )
}

export function ErrorBoundary() {
    const error = useRouteError();
  
    if (isRouteErrorResponse(error)) {
      return (
        <div>
          <h1>
            {error.status} {error.statusText}
          </h1>
          <p>{error.data}</p>
        </div>
      );
    } else if (error instanceof Error) {
      return (
        <div>
          <h1>Error</h1>
          <p>{error.message}</p>
          <p>The stack trace is:</p>
          <pre>{error.stack}</pre>
        </div>
      );
    } else {
      return <h1>Unknown Error</h1>;
    }
  }