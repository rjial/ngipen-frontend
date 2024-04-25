import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Link, NavLink, useOutletContext } from "@remix-run/react";
import { ChevronRight, Home, Menu, Package, Package2, Search, Settings, User } from "lucide-react";
import { PropsWithChildren, useState } from "react";
import { UserClaim } from "~/data/entity/auth/UserClaim";
import { NavbarUser } from "../common/Navbar";
import { Input } from "@/components/ui/input";

export type DashboardMenuCollapsibleProp = {
    title: string,
    icon: JSX.Element
}

export type DashboardMenuCollapsibleItemProp = {
    title: string,
    icon: JSX.Element,
    to: string
}

export const DashboardMenuCollapsibleItem: React.FC<DashboardMenuCollapsibleItemProp> = ({ icon, title, to }: DashboardMenuCollapsibleItemProp) => (<div className="grid gap-2 px-6">
    <NavLink
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
        to={to}
    >
        {icon}
        {title}
    </NavLink>
</div>);

export const DashboardMenuCollapsible: React.FC<PropsWithChildren<DashboardMenuCollapsibleProp>> = (props: PropsWithChildren<DashboardMenuCollapsibleProp>) => {
    const [open, setOpen] = useState(false)
    return (
        <Collapsible open={open} onOpenChange={(opened) => setOpen(opened)} className="grid gap-2">
            <CollapsibleTrigger className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 [&[data-state=open]>svg]:rotate-90">
                {/* <Package size={16} /> */}
                {props.title}
                <ChevronRight className="ml-auto transition-transform" size={16} />
            </CollapsibleTrigger>
            <CollapsibleContent>
                {props.children}
            </CollapsibleContent>
        </Collapsible>
    )
};

export type DashboardMenuItem = {
    title: string,
    icon: JSX.Element,
    to: string
}

export const DashboardMenuItem: React.FC<PropsWithChildren<DashboardMenuItem>> = ({ title, icon, children, to }: PropsWithChildren<DashboardMenuItem>) => {
    return (
        <div>
            <NavLink
                className={({ isActive }) => cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900  dark:hover:text-gray-50", isActive ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" : "text-gray-500 dark:text-gray-400")}
                to={to}
                end
            >
                {icon}
                {title}

            </NavLink>
            {children}
        </div>
    )
};

export const DashboardMenu: React.FC = () => {
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

export type DashboardMobileSheetItemProp = {
    to: string,
    icon: JSX.Element,
    title: string
}

export const DashboardMobileSheetItem: React.FC<PropsWithChildren<DashboardMobileSheetItemProp>> = ({ to, icon, children, title }: PropsWithChildren<DashboardMobileSheetItemProp>) => (
    <div>
        <NavLink
            className={({ isActive }) => cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900  dark:hover:text-gray-50", isActive ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" : "text-gray-500 dark:text-gray-400")}
            to={to}
            end
        >
            {icon}
            {title}

        </NavLink>
        {children}
    </div>
);

export const useDashboardMobileSheet = () => {
    const [openSheet, setOpenSheet] = useState(false)
    const component: React.FC = () => {
        return (
            <Sheet open={openSheet} onOpenChange={(openedSheet) => setOpenSheet(openedSheet)}>
                <SheetContent side="left">
                    <div className="flex h-full max-h-screen flex-col gap-2">
                        <div className="flex h-[60px] items-center border-b px-6">
                            <Link className="flex items-center gap-2 font-semibold" to="#">
                                <span className="">Ngipen</span>
                            </Link>
                        </div>
                        <div className="flex-1 overflow-auto py-2">
                            <nav className="grid items-start px-4 text-sm font-medium">
                                <DashboardMobileSheetItem title="Home" to="/dashboard" icon={<Home size={16} />} />
                                <DashboardMobileSheetItem title="Users" to="/dashboard/user" icon={<User size={16} />} />
                                {/* <DashboardMobileSheetItem title="Products" to="/dashboard/user" icon={<Package size={16} />} /> */}
                                {/* <DashboardMenuCollapsible title="Product Management" icon={<Package size={16} />}>
                                    <DashboardMenuCollapsibleItem icon={<Package size={16} />} title="All Products" to="/dashboard/package" />
                                </DashboardMenuCollapsible> */}
                                <DashboardMobileSheetItem title="Settings" to="/dashboard/setting" icon={<Settings size={16} />} />
                            </nav>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        )
    };
    return { handleSheet: () => setOpenSheet(!openSheet), DashboardMobileSheet: component }
}

export const DashboardHeader: React.FC<{
    handleSheet: () => void;
}> = ({ handleSheet }) => {
    const { user } = useOutletContext<{ user: UserClaim | undefined, checkoutCount: number }>()
    return (<header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
        <Button className="lg:hidden" size="icon" variant="outline" onClick={() => handleSheet()}>
            <Menu size={16} />
            <span className="sr-only">Toggle navigation menu</span>
        </Button>
        <div className="flex-1">
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
        </div>
        <div className="flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <NavbarUser user={user} />
        </div>
    </header>)
};