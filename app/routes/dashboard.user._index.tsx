import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Link, NavLink, useFetcher, useLoaderData, useLocation } from "@remix-run/react";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { UserItem } from "~/data/entity/auth/User";
import { Page } from "~/data/entity/common/Page";
import { IUserService } from "~/service/user/IUserService";
import { destroySession } from "~/sessions";
import { getAuthSession } from "~/utils/authUtil";
import { levelName } from "~/utils/levelUtil";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    try {
        const url = new URL(request.url)
        const page = Number(url.searchParams.get("page")) || 0
        // const size = Number(url.searchParams.get("size")) || 10
        const size = 10
        const userService = new IUserService()
        const res = await userService.getUsers({ page: page, size: size, request: request })
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

export default function DashboardUserPage() {
    const data = useLoaderData<typeof loader>()
    const { search } = useLocation()
    const page = new URLSearchParams(search).get("page")
    const dataRes: Page<UserItem> | undefined = data.data || undefined
    const [initialData, setInitialData] = useState<Page<UserItem> | undefined>(dataRes)
    const fetcher = useFetcher<{error: boolean, message: string, data: Page<UserItem> | undefined}>()
    const { toast } = useToast()
    useEffect(() => {
        if (fetcher.data != undefined) {
            setInitialData(fetcher.data.data)
        }
    }, [fetcher.data])
    return (
        <div className="flex flex-col w-full gap-4">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-bold">User Management</h1>
                <form className="flex items-center gap-4">
                    <Input className="w-[300px] sm:w-[400px]" placeholder="Search..." type="search" />
                </form>
            </div>
            <div className="border rounded-lg shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px]">Username</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="w-[100px]">Role</TableHead>
                            <TableHead className="w-[100px]">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialData && initialData.content.map((userItem) => {
                            return (
                                <TableRow>
                                    <TableCell>
                                        <Link to={`/dashboard/user/${userItem.uuid}`}>
                                            <div className="flex items-center">
                                                <img
                                                    alt="Avatar"
                                                    className="rounded-full"
                                                    height="32"
                                                    src="https://source.unsplash.com/U7HLzMO4SIY"
                                                    style={{
                                                        aspectRatio: "32/32",
                                                        objectFit: "cover",
                                                    }}
                                                    width="32"
                                                />
                                                <div className="ml-2 font-medium">{userItem.name}</div>
                                            </div>
                                        </Link>
                                    </TableCell>
                                    <TableCell><Link to={`/dashboard/user/${userItem.uuid}`}>{userItem.email}</Link></TableCell>
                                    <TableCell><Link to={`/dashboard/user/${userItem.uuid}`}>{levelName(userItem.level)}</Link></TableCell>
                                    <TableCell>
                                        <Link to={`/dashboard/user/${userItem.uuid}`}>
                                            <Badge>Active</Badge>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                        {/* <TableRow>
                            <TableCell>
                                <div className="flex items-center">
                                    <img
                                        alt="Avatar"
                                        className="rounded-full"
                                        height="32"
                                        src="https://source.unsplash.com/U7HLzMO4SIY"
                                        style={{
                                            aspectRatio: "32/32",
                                            objectFit: "cover",
                                        }}
                                        width="32"
                                    />
                                    <div className="ml-2 font-medium">alice_smith</div>
                                </div>
                            </TableCell>
                            <TableCell>alice@example.com</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>
                                <Badge variant="outline">Inactive</Badge>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <div className="flex items-center">
                                    <img
                                        alt="Avatar"
                                        className="rounded-full"
                                        height="32"
                                        src="https://source.unsplash.com/U7HLzMO4SIY"
                                        style={{
                                            aspectRatio: "32/32",
                                            objectFit: "cover",
                                        }}
                                        width="32"
                                    />
                                    <div className="ml-2 font-medium">robert_jones</div>
                                </div>
                            </TableCell>
                            <TableCell>robert@example.com</TableCell>
                            <TableCell>Admin</TableCell>
                            <TableCell>
                                <Badge>Active</Badge>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <div className="flex items-center">
                                    <img
                                        alt="Avatar"
                                        className="rounded-full"
                                        height="32"
                                        src="https://source.unsplash.com/U7HLzMO4SIY"
                                        style={{
                                            aspectRatio: "32/32",
                                            objectFit: "cover",
                                        }}
                                        width="32"
                                    />
                                    <div className="ml-2 font-medium">linda_wilson</div>
                                </div>
                            </TableCell>
                            <TableCell>linda@example.com</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>
                                <Badge variant="outline">Inactive</Badge>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <div className="flex items-center">
                                    <img
                                        alt="Avatar"
                                        className="rounded-full"
                                        height="32"
                                        src="https://source.unsplash.com/U7HLzMO4SIY"
                                        style={{
                                            aspectRatio: "32/32",
                                            objectFit: "cover",
                                        }}
                                        width="32"
                                    />
                                    <div className="ml-2 font-medium">mike_brown</div>
                                </div>
                            </TableCell>
                            <TableCell>mike@example.com</TableCell>
                            <TableCell>Admin</TableCell>
                            <TableCell>
                                <Badge>Active</Badge>
                            </TableCell>
                        </TableRow> */}
                    </TableBody>
                </Table>
            </div>
            {initialData && <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 text-sm">
                    <span className="hidden md:inline">Showing 1 to 5 of {initialData.totalElements} entries</span>
                    <span className="md:hidden">Showing 1-5 of 100</span>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" disabled={initialData.first}>Previous</Button>
                    {[...Array(initialData.totalPages).keys()].map((item) => <Button onClick={() => fetcher.load(`/dashboard/user?page=${item}`)} variant={(Number(initialData.pageable.pageNumber || 0)) == item ? "default" : "outline"}>{item + 1}</Button>)}
                    <Button variant="outline" disabled={initialData.last}>Next</Button>
                </div>
            </div>}
        </div>
    )
}