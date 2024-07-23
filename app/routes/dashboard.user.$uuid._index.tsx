import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Link, NavLink, useLoaderData, useLocation } from "@remix-run/react";
import { ArrowLeft, CalendarDaysIcon, Pencil, PencilIcon, SearchIcon, Trash, UserPlusIcon } from "lucide-react";
import { useEffect } from "react";
import { UserCard } from "~/components/dashboard/user/UserCard";
import { UserItem } from "~/data/entity/auth/User";
import { Page } from "~/data/entity/common/Page";
import { IUserService } from "~/service/user/IUserService";
import { destroySession } from "~/sessions";
import { getAuthSession } from "~/utils/authUtil";
import { levelName } from "~/utils/levelUtil";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    try {
        const uuid = params.uuid || ""
        // const size = Number(url.searchParams.get("size")) || 10
        const userService = new IUserService()
        const res = await userService.getUser({ uuid: uuid, request: request })
        if (res.status_code == 200) {
            return json({ error: false, message: res.message, data: res.data })
        } else if(res.status_code == 401) {
            const session = await getAuthSession(request)
            return redirect("/login", {
                headers: {
                    "Set-Cookie": await destroySession(session)
                }
            })
        } else {
            return json({ error: true, message: res.message, data: undefined })
        }
    } catch (err) {
        //@ts-ignore
        return json({ error: true, message: err.message, data: undefined })
    }
}

export default function DashboardUserDetailPage() {
    const data = useLoaderData<typeof loader>()
    // const { search } = useLocation()
    // const page = new URLSearchParams(search).get("page")
    const dataRes: UserItem | undefined = data.data || undefined
    const { toast } = useToast()
    useEffect(() => {
        if (data != undefined) {
            toast({ title: data.message, variant: data.error ? "destructive" : "default" })
        }
    }, [data])
    return (
        <main className="flex flex-col w-full gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button asChild size="icon" variant="outline">
                        <Link to="/dashboard/user">
                            <ArrowLeft size={16} />
                            <span className="sr-only">Back</span>
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">User Details</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" asChild>
                        <Link to={`/dashboard/user/${dataRes?.uuid}/edit`}>
                            <Pencil size={16} />
                            <span className="sr-only">Edit</span>
                        </Link>
                    </Button>
                    <Button size="icon" variant="outline" asChild>
                        <Link to={`/dashboard/user/${dataRes?.uuid}/delete`}>
                            <Trash size={16} />
                            <span className="sr-only">Delete</span>
                        </Link>
                    </Button>
                </div>
            </div>
            <UserCard dataRes={dataRes} />
        </main>
    )
}