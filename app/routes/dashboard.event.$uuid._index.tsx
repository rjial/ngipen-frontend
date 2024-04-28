import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Link, NavLink, useLoaderData, useLocation } from "@remix-run/react";
import { ArrowLeft, CalendarDaysIcon, Pencil, PencilIcon, Plus, SearchIcon, Trash, UserPlusIcon } from "lucide-react";
import { useEffect } from "react";
import { UserItem } from "~/data/entity/auth/User";
import { Page } from "~/data/entity/common/Page";
import { Event } from "~/data/entity/events/Event";
import { JenisTiket } from "~/data/entity/events/JenisTiket";
import { IEventService } from "~/service/events/IEventService.server";
import { IUserService } from "~/service/user/IUserService";
import { destroySession } from "~/sessions";
import { getAuthSession } from "~/utils/authUtil";
import { handleDate } from "~/utils/dateUtil";
import { levelName } from "~/utils/levelUtil";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const eventService = new IEventService()
    try {
        const eventUuid = params.uuid || ""
        const eventRes = await eventService.getEvent(eventUuid, request)
        const jenisTiketRes = await eventService.getJenisTiket(eventRes.data?.uuid!)
        if (eventRes.status_code == 200) {
            return json({ error: false, message: eventRes.message, data: {event: eventRes.data, jenisTiket: jenisTiketRes.data} })
        } else if(eventRes.status_code == 401) {
            const session = await getAuthSession(request)
            return redirect("/login", {
                headers: {
                    "Set-Cookie": await destroySession(session)
                }
            })
        } else {
            return json({ error: true, message: eventRes.message, data: undefined })
        }
    } catch(err) {
        // @ts-ignore
        return json({ error: true, message: err.message, data: undefined })
    }
}

export default function DashboardEventDetailPage() {
    const data = useLoaderData<typeof loader>()
    // const { search } = useLocation()
    // const page = new URLSearchParams(search).get("page")
    const eventRes: Event | undefined = data.data.event || undefined
    const jenisTiketRes: JenisTiket[] | undefined = data.data.jenisTiket || undefined
    const { toast } = useToast()
    // if (data != undefined) {
    //     toast({ title: data.message, variant: data.error ? "destructive" : "default" })
    // }
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
                        <Link to="/dashboard/event">
                            <ArrowLeft size={16} />
                            <span className="sr-only">Back</span>
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Event Details</h1>
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
            <div className="gap-4">
                <div className="space-y-4">
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
                                <div className="font-medium">{eventRes?.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{eventRes?.lokasi}</div>
                            </div>
                        </div>
                        <div className="p-4 grid md:grid-cols-3 gap-4">
                            <div className="grid gap-1">
                                <div className="text-sm text-gray-500 dark:text-gray-400">Lokasi</div>
                                <div className="font-medium">{eventRes?.lokasi}</div>
                            </div>
                            <div className="grid gap-1">
                                <div className="text-sm text-gray-500 dark:text-gray-400">Tanggal Event</div>
                                <div className="font-medium">{handleDate(eventRes?.tanggal_awal || "")}</div>
                            </div>
                            <div className="grid gap-1">
                                <div className="text-sm text-gray-500 dark:text-gray-400">Waktu Event</div>
                                <div className="font-medium">
                                    {eventRes?.waktu_awal} - {eventRes?.waktu_akhir}
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
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold">Jenis Tiket</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button asChild size="icon" variant="outline">
                                <Link to={`/dashboard/event/${eventRes?.uuid}/jenistiket/add`}>
                                    <Plus size={16} />
                                    <span className="sr-only">Add</span>
                                </Link>
                            </Button>
                            <Button size="icon" variant="outline">
                                <Pencil size={16} />
                                <span className="sr-only">Edit</span>
                            </Button>
                        </div>
                    </div>
                    <div className="border rounded-lg shadow-sm">
                        <Table className="table-auto">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-fit">Id</TableHead>
                                    <TableHead className="">Jenis Tiket</TableHead>
                                    <TableHead className="">Harga</TableHead>
                                    <TableHead className="">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {jenisTiketRes && jenisTiketRes.map((jenisTiketItem) => {
                                    return (
                                        <TableRow>
                                            <TableCell>
                                                {jenisTiketItem.id}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <div className="ml-2 font-medium">{jenisTiketItem.nama}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>Rp {jenisTiketItem.harga}</TableCell>
                                            <TableCell>
                                                <Button asChild size="icon" variant="outline">
                                                    <Link to={`/dashboard/event/${eventRes?.uuid}/jenistiket/${jenisTiketItem.id}/delete`}>
                                                        <Trash  size={16} />
                                                        <span className="sr-only">Delete</span>
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold">Deskripsi</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button size="icon" variant="outline">
                                <Pencil size={16} />
                                <span className="sr-only">Edit</span>
                            </Button>
                        </div>
                    </div>
                    <div className="border rounded-lg shadow-sm">
                        <div className="p-4 text-justify">
                            {eventRes?.desc}
                            {/* Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quas praesentium aliquam ut, et accusantium architecto rerum! Doloribus aliquid esse quod eum error excepturi quos deleniti. Aliquid ipsum porro dolores facilis? */}
                        </div>
                    </div>
                </div>
                {/* <div className="space-y-4">
                    <div className="h-fit">
                        <Card className="h-fit">
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
                    </div>
                    <Card className="h-fit">
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
                </div> */}
            </div>
        </main>
    )
}