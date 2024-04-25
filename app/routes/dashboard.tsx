import { Button } from "@/components/ui/button"
import { CollapsibleTrigger, CollapsibleContent, Collapsible } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu"
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet"
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Link, NavLink, Outlet, useOutletContext } from "@remix-run/react"
import { PropsWithChildren, useState } from "react"
import { NavBar, NavbarUser } from "~/components/common/Navbar"
import { UserClaim } from "~/data/entity/auth/UserClaim"
import { cn } from "@/lib/utils"
import { Bell, ChevronRight, Home, Menu, Package, Package2, Search, Settings, ShoppingCart, User } from "lucide-react"

export type DashboardMenuCollapsibleProp = {
    title: string,
    icon: JSX.Element
}

export type DashboardMenuCollapsibleItemProp = {
    title: string,
    icon: JSX.Element
}

const DashboardMenuCollapsibleItem: React.FC<DashboardMenuCollapsibleItemProp> = ({ icon, title }: DashboardMenuCollapsibleItemProp) => (<div className="grid gap-2 px-6">
    <Link
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
        to="#"
    >
        {icon}
        {title}
    </Link>
</div>);

const DashboardMenuCollapsible: React.FC<PropsWithChildren<DashboardMenuCollapsibleProp>> = (props: PropsWithChildren<DashboardMenuCollapsibleProp>) => {
    const [open, setOpen] = useState(false)
    return (
        <Collapsible open={open} onOpenChange={(opened) => setOpen(opened)} className="grid gap-2">
            <CollapsibleTrigger className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 [&[data-state=open]>svg]:rotate-90">
                <Package size={16} />
                {props.title}
                <ChevronRight className="ml-auto transition-transform" size={16} />
            </CollapsibleTrigger>
            <CollapsibleContent>
                {props.children}
            </CollapsibleContent>
        </Collapsible>
    )
};

type DashboardMenuItem = {
    title: string,
    icon: JSX.Element,
    to: string
}

const DashboardMenuItem: React.FC<PropsWithChildren<DashboardMenuItem>> = ({ title, icon, children, to }: PropsWithChildren<DashboardMenuItem>) => {
    return (
        <div>
            <NavLink
                className={({isActive}) => cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900  dark:hover:text-gray-50", isActive ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" : "text-gray-500 dark:text-gray-400")}
                to={to}
            >
                {icon}
                {title}

            </NavLink>
            {children}
        </div>
    )
};

const DashboardMenu: React.FC = () => {
    return (
        <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
                <DashboardMenuItem title="Home" icon={<Home size={16} />} to="/dashboard" />
                <DashboardMenuItem title="Users" icon={<User size={16} />} to="/dashboard/user" />
                {/* <DashboardMenuItem title="Product" icon={<Package size={16} />} to="/dashboard/">
                    <DashboardMenuCollapsible title="Product Management" icon={<Package size={16} />}>
                        <DashboardMenuCollapsibleItem icon={<Package size={16} />} title="All Products" />
                    </DashboardMenuCollapsible>
                </DashboardMenuItem> */}
                {/* <DashboardMenuItem title="Orders" icon={<ShoppingCart size={16} />} to="/dashboard/" /> */}
                <DashboardMenuItem title="Settings" icon={<Settings size={16} />} to="/dashboard/setting" />
            </nav>
        </div>
    )
};

const useDashboardMobileSheet = () => {
    const [openSheet, setOpenSheet] = useState(false)
    const component: React.FC = () => {
        return (<Sheet open={openSheet} onOpenChange={(openedSheet) => setOpenSheet(openedSheet)}>
            <SheetContent side="left">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-[60px] items-center border-b px-6">
                        <Link className="flex items-center gap-2 font-semibold" to="#">
                            <Package2 size={16} />
                            <span className="">Acme Inc</span>
                        </Link>
                    </div>
                    <div className="flex-1 overflow-auto py-2">
                        <nav className="grid items-start px-4 text-sm font-medium">
                            <Link
                                className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
                                to="#"
                            >
                                <Home size={16} />
                                Home
                            </Link>
                            <Link
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                                to="#"
                            >
                                <User size={16} />
                                Users
                            </Link>
                            <div className="grid gap-2">
                                <Link
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                                    to="#"
                                >
                                    <Package size={16}/>
                                    Products
                                </Link>
                                <DashboardMenuCollapsible title="Product Management" icon={<Package size={16} />}>
                                    <DashboardMenuCollapsibleItem icon={<Package size={16} />} title="All Products" />
                                </DashboardMenuCollapsible>
                            </div>
                            <Link
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                                to="#"
                            >
                                <ShoppingCart size={16} />
                                Orders
                            </Link>
                            <Link
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                                to="#"
                            >
                                <Settings size={16}/>
                                Settings
                            </Link>
                        </nav>
                    </div>
                </div>
            </SheetContent>
        </Sheet>)
    };
    return { handleSheet: () => setOpenSheet(!openSheet), DashboardMobileSheet: component }
}

export default function DashboardLayout() {
    const { user } = useOutletContext<{ user: UserClaim | undefined, checkoutCount: number }>()
    const { handleSheet, DashboardMobileSheet } = useDashboardMobileSheet()
    return (
        <div className="grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-[60px] items-center border-b px-6">
                        <Link className="flex items-center gap-2 font-semibold" to="#">
                            <Package2 size={16} />
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
                <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
                    <Button className="lg:hidden" size="icon" variant="outline" onClick={() => handleSheet()}>
                        <Menu size={16} />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                    <div className="flex-1">
                        <h1 className="font-semibold text-lg">Overview</h1>
                    </div>
                    <div className="flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                        <form className="ml-auto flex-1 sm:flex-initial">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 text-gray-500 dark:text-gray-400" />
                                <Input
                                    className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-white"
                                    placeholder="Search orders..."
                                    type="search"
                                />
                            </div>
                        </form>
                        <NavbarUser user={user} />
                    </div>
                </header>
                <DashboardMobileSheet />
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}