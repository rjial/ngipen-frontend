import { AlertDialog, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Link, NavLink, useActionData, useFetcher, useLoaderData, useLocation, useOutletContext } from "@remix-run/react";
import { ArrowLeft, CalendarDaysIcon, Ellipsis, Pencil, PencilIcon, Plus, ScanLine, SearchIcon, Trash, UserPlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { UserItem } from "~/data/entity/auth/User";
import { Page } from "~/data/entity/common/Page";
import { Event } from "~/data/entity/events/Event";
import { JenisTiket } from "~/data/entity/events/JenisTiket";
import { IEventService } from "~/service/events/IEventService.server";
import { IUserService } from "~/service/user/IUserService";
import { destroySession } from "~/sessions";
import { getAuthSession } from "~/utils/authUtil";
import { handleDate, handleDateTime } from "~/utils/dateUtil";
import { levelName } from "~/utils/levelUtil";
import { BarcodeScanner } from '@alzera/react-scanner';
import { ITicketService } from "~/service/ticket/ITicketService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tiket } from "~/data/entity/ticket/Tiket";
import { IPaymentService } from "~/service/payment/IPaymentService";
import { PaymentTransactionResponse } from "~/data/dto/payment/PaymentTransactionResponse";
import { TiketsTable } from "~/components/dashboard/tiket/TiketsTable";
import { TiketItemListResponse } from "~/data/dto/ticket/TiketItemListResponse";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const eventService = new IEventService()
    const paymentService = new IPaymentService()
    try {
        const eventUuid = params.uuid || ""
        const ptUuid = params.uuidPt || ""
        const url = new URL(request.url)
        const page = Number(url.searchParams.get("page")) || 0

        const paymentRes = await paymentService.getPaymentTransactionItemByEvent({uuidEvent: eventUuid, uuidPt: ptUuid}, request)
        if (paymentRes.status_code == 200) {
            const tiketsRes = await paymentService.getTiketsByPaymentTransactionAndEvent({uuidEvent: eventUuid, uuidPt: paymentRes.data?.uuid!, page: page, size: 10}, request)
            console.log(tiketsRes)
            return json({ error: false, message: paymentRes.message, data: {payment: paymentRes.data, tiket: tiketsRes.data} })
        } else if(paymentRes.status_code == 401) {
            const session = await getAuthSession(request)
            return redirect("/login", {
                headers: {
                    "Set-Cookie": await destroySession(session)
                }
            })
        } else {
            return json({ error: true, message: paymentRes.message, data: undefined })
        }

    //     const paymentsRes = await paymentService.getPaymentTransactionsByEvent({uuidEvent: eventUuid, page: page, size: 10}, request)
    } catch(err) {
        // @ts-ignore
        return json({ error: true, message: err.message, data: undefined })
    }
    // return {}
}

export default function DashboardEventPaymentTransactionItemPage() {
    const data = useLoaderData<typeof loader>()
    console.log(data)
    const paymentRes: PaymentTransactionResponse | undefined = data.data.payment || undefined
    const tiketRes: Page<Tiket> | undefined = data.data.tiket || undefined
    // useEffect(() => {
    //     if (typeof paymentRes != "undefined") {
    //         console.log(paymentRes)
    //     }
    // }, [paymentRes])
    const {eventRes} = useOutletContext<{eventRes: Event | undefined}>()
    return (
        <>
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button asChild size="icon" variant="outline">
                            <Link to={`/dashboard/event/${eventRes?.uuid}/paymenttransaction`}>
                                <ArrowLeft size={16} />
                                <span className="sr-only">Back</span>
                            </Link>
                        </Button>
                        <h1 className="text-2xl font-bold">Detail Payment Transaction</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* <Button asChild size="icon" variTiketant="outline">
                        <Link to={`/dashboard/event/${eventRes?.uuid}/jenistiket/add`}>
                            <Plus size={16} />
                            <span className="sr-only">Add</span>
                        </Link>
                    </Button> */}
                    </div>
                </div>
                {paymentRes && (
                    <>
                        <div className="border rounded-lg shadow-sm">
                            {/* <div className="flex items-center gap-4 p-4 border-b">
                        <div>
                            <div className="font-medium">{eventRes?.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{eventRes?.lokasi}</div>
                        </div>
                    </div> */}
                            <div className="p-4 grid md:grid-cols-3 gap-4">
                                <div className="grid gap-1">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">UUID</div>
                                    <div className="font-medium">{paymentRes.uuid}</div>
                                </div>
                                <div className="grid gap-1">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Tanggal Bayar</div>
                                    <div className="font-medium">Rp {paymentRes.total}</div>
                                </div>
                                <div className="grid gap-1">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Status Pembayaran</div>
                                    <div className="font-medium">
                                        {paymentRes.status}
                                    </div>
                                </div>
                                <div className="grid gap-1">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Nama Pembeli</div>
                                    <div className="font-medium">{paymentRes.user}</div>
                                </div>
                                <div className="grid gap-1">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Created At</div>
                                    <div className="font-medium">2022-06-15 03:45 PM</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold">Tiket</h1>
                        </div>
                        <div className="border rounded-lg shadow-sm">
                            {eventRes && tiketRes && <TiketsTable eventRes={eventRes} tiketRes={tiketRes} />}
                        </div>
                    </>)
                }

            </div>
        </>
    )
}