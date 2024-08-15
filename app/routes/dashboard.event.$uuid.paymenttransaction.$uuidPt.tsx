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
import { UserCard } from "~/components/dashboard/user/UserCard";
import { string } from "zod";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const eventService = new IEventService()
    const paymentService = new IPaymentService()
    try {
        const eventUuid = params.uuid || ""
        const ptUuid = params.uuidPt || ""
        const url = new URL(request.url)
        const page = Number(url.searchParams.get("page")) || 0

        const paymentRes = await paymentService.getPaymentTransactionItemByEvent({uuidEvent: eventUuid, uuidPt: ptUuid}, request)
        const userPaymentRes = await paymentService.getUserByPaymentTransactionAndEvent({uuidEvent: eventUuid, uuidPt: ptUuid}, request)
        if (paymentRes.status_code == 200) {
            const tiketsRes = await paymentService.getTiketsByPaymentTransactionAndEvent({uuidEvent: eventUuid, uuidPt: paymentRes.data?.uuid!, page: page, size: 10}, request)
            return json({ error: false, message: paymentRes.message, data: {payment: paymentRes.data, tiket: tiketsRes.data, user: userPaymentRes.data} })
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

    } catch(err) {
        // @ts-ignore
        return json({ error: true, message: err.message, data: undefined })
    }
}

export default function DashboardEventPaymentTransactionItemPage() {
    const data = useLoaderData<{error: true, message: string, data: undefined} | {error: false, message: string, data: {payment: PaymentTransactionResponse | undefined, tiket: Page<Tiket> | undefined, user: UserItem | undefined}}>()
    const {eventRes} = useOutletContext<{eventRes: Event | undefined}>()
    return data.error ? (
        <h1>Error : {data.message}</h1>
    ) : (
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
                    </div>
                </div>
                {data.data.payment && (
                    <>
                        <div className="border rounded-lg shadow-sm">
                            <div className="p-4 grid md:grid-cols-3 gap-4">
                                <div className="grid gap-1">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">UUID</div>
                                    <div className="font-medium">{data.data.payment.uuid}</div>
                                </div>
                                <div className="grid gap-1">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Tanggal Bayar</div>
                                    <div className="font-medium">Rp {data.data.payment.total}</div>
                                </div>
                                <div className="grid gap-1">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Status Pembayaran</div>
                                    <div className="font-medium">
                                        {data.data.payment.status}
                                    </div>
                                </div>
                                <div className="grid gap-1">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Nama Pembeli</div>
                                    <div className="font-medium">{data.data.payment.user}</div>
                                </div>
                                <div className="grid gap-1">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Created At</div>
                                    <div className="font-medium">2022-06-15 03:45 PM</div>
                                </div>
                            </div>
                        </div>
                        {data.data.user && <>
                            <div className="flex items-center gap-4">
                                <h1 className="text-2xl font-bold">User</h1>
                            </div>
                            <UserCard dataRes={data.data.user} />
                        </>}
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold">Tiket</h1>
                        </div>
                        <div className="border rounded-lg shadow-sm">
                            {eventRes && data.data.tiket && <TiketsTable eventRes={eventRes} tiketRes={data.data.tiket} />}
                        </div>
                    </>)
                }

            </div>
        </>
    )
}