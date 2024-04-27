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
                    <Button size="icon" variant="outline">
                        <Pencil size={16} />
                        <span className="sr-only">Edit</span>
                    </Button>
                    <Button size="icon" variant="outline">
                        <Trash size={16} />
                        <span className="sr-only">Delete</span>
                    </Button>
                </div>
            </div>
            <div className="grid md:grid-cols-[1fr_300px] gap-6">
                <div className="border rounded-lg shadow-sm">
                    <div className="flex items-center gap-4 p-4 border-b">
                        <img
                            alt="Avatar"
                            className="rounded-full"
                            height="48"
                            src="https://source.unsplash.com/U7HLzMO4SIY"
                            style={{
                                aspectRatio: "48/48",
                                objectFit: "cover",
                            }}
                            width="48"
                        />
                        <div>
                            <div className="font-medium">{dataRes?.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{dataRes?.email}</div>
                        </div>
                    </div>
                    <div className="p-4 grid gap-4">
                        <div className="grid gap-1">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
                            <div className="font-medium">{dataRes?.email}</div>
                        </div>
                        <div className="grid gap-1">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Role</div>
                            <div className="font-medium">{levelName(dataRes?.level || "")}</div>
                        </div>
                        <div className="grid gap-1">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
                            <div>
                                <Badge>Active</Badge>
                            </div>
                        </div>
                        <div className="grid gap-1">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Last Login</div>
                            <div className="font-medium">2023-04-25 10:30 AM</div>
                        </div>
                        <div className="grid gap-1">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Created At</div>
                            <div className="font-medium">2022-06-15 03:45 PM</div>
                        </div>
                    </div>
                </div>
                <div className="grid gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                        <CalendarDaysIcon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-medium">Logged in</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">2023-04-25 10:30 AM</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                                        <UserPlusIcon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-medium">Account created</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">2022-06-15 03:45 PM</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400">
                                        <PencilIcon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-medium">Profile updated</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">2023-03-10 04:20 PM</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Permissions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                <div className="flex items-center justify-between">
                                    <div className="font-medium">Admin</div>
                                    <Badge>Full Access</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="font-medium">User</div>
                                    <Badge variant="outline">Read-Only</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    )
}