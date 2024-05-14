import { AlertDialog, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Link, NavLink, useActionData, useFetcher, useLoaderData, useLocation, useOutletContext } from "@remix-run/react";
import { ArrowLeft, CalendarDaysIcon, Check, Ellipsis, Pencil, PencilIcon, Plus, ScanLine, SearchIcon, Trash, UserPlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
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
import { BarcodeScanner } from '@alzera/react-scanner';
import { ITicketService } from "~/service/ticket/ITicketService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tiket } from "~/data/entity/ticket/Tiket";
import { TiketItemListResponse } from "~/data/dto/ticket/TiketItemListResponse";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const eventService = new IEventService()
    const tiketService = new ITicketService()
    try {
        const tiketUuid = params.uuidTiket || ""
        const tiketRes = await tiketService.getTiket({uuid: tiketUuid, request: request})
        if (tiketRes.status_code == 200) {
            let message = ""
            if ((await getAuthSession(request)).get("error") != undefined) {
                message = (await getAuthSession(request)).get("error") || ""
            }
            return json({ error: false, message: tiketRes.message, data: {tiket: tiketRes.data, messageFlash: message == "" ? undefined : message} })
        } else if(tiketRes.status_code == 401) {
            const session = await getAuthSession(request)
            return redirect("/login", {
                headers: {
                    "Set-Cookie": await destroySession(session)
                }
            })
        } else {
            const message = (await getAuthSession(request)).get("error") || ""
            return json({ error: true, message: tiketRes.message, data: {tiket: undefined, messageFlash: message} })
        }
    } catch(err) {
        const message = (await getAuthSession(request)).get("error") || ""
        // @ts-ignore
        return json({ error: true, message: err.message, data: {tiket: undefined, messageFlash: message} })
    }
}

export default function DashboardEventTiketListPage() {
    const data = useLoaderData<typeof loader>()
    console.log(data)
    const {toast} = useToast()
    // @ts-ignore
    const tiketRes: TiketItemListResponse | undefined = data.data.tiket
    useEffect(() => {
        if (typeof tiketRes != "undefined") {
            console.log(tiketRes)
        }
    }, [tiketRes])
    const {eventRes} = useOutletContext<{eventRes: Event | undefined}>()
    useEffect(() => {
        if(data.data.messageFlash != undefined) toast({title: data.data.messageFlash, variant: "destructive"})
    }, [data.data.messageFlash])
    return (
        <>
        <div className="space-y-3">
           <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button asChild size="icon" variant="outline">
                        <Link to={`/dashboard/event/${eventRes?.uuid}/tiket`}>
                            <ArrowLeft size={16} />
                            <span className="sr-only">Back</span>
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Tiket</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button asChild size="icon" variant={tiketRes?.statusTiket ? "destructive" : "default"}>
                        <Link to={`/dashboard/event/${eventRes?.uuid}/tiket/${tiketRes?.uuid}/verify?status=${tiketRes?.statusTiket ? 0 : 1}`}>
                            <Check className="text-white" size={16} />
                            <span className="sr-only">Verify Tiket</span>
                        </Link>
                    </Button>
                </div>
                </div>
                {tiketRes && 
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
                            <div className="text-sm text-gray-500 dark:text-gray-400">UUID</div>
                            <div className="font-medium">{tiketRes.uuid}</div>
                        </div>
                        <div className="grid gap-1">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Nama Pemilik Tiket</div>
                            <div className="font-medium"><Link to={`/dashboard/user/${tiketRes.user.uuid}`}>{tiketRes.user.namaUser}</Link></div>
                        </div>
                        <div className="grid gap-1">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Status Verifikasi</div>
                            <div className="font-medium">
                                {tiketRes.statusTiket ? "Terverifikasi" : "Belum Terverifikasi"}
                            </div>
                        </div>
                        <div className="grid gap-1">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Jenis Tiket</div>
                            <div className="font-medium">{tiketRes.jenisTiket}</div>
                        </div>
                        <div className="grid gap-1">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Waktu Event</div>
                            <div className="font-medium">{handleDate(tiketRes.date)} ({tiketRes.waktu_awal} - {tiketRes.waktu_akhir})</div>
                        </div>
                        <div className="grid gap-1">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Harga Tiket</div>
                            <div className="font-medium">Rp {tiketRes.price}</div>
                        </div>
                        <div className="grid gap-1">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Payment Transaction</div>
                            <div className="font-medium"><Link to={`/dashboard/event/${eventRes?.uuid}/paymenttransaction/${tiketRes.paymentTransaction}`}>{tiketRes.paymentTransaction}</Link></div>
                        </div>
                    </div>
                </div> }
            </div> 
        </>
    )
}