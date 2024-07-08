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

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const eventService = new IEventService()
    const paymentService = new IPaymentService()
    try {
        const eventUuid = params.uuid || ""
        const url = new URL(request.url)
        const page = Number(url.searchParams.get("page")) || 0

        const paymentsRes = await paymentService.getPaymentTransactionsByEvent({uuidEvent: eventUuid, page: page, size: 10}, request)
        if (paymentsRes.status_code == 200) {
            return json({ error: false, message: paymentsRes.message, data: {payments: paymentsRes.data} })
        } else if(paymentsRes.status_code == 401) {
            const session = await getAuthSession(request)
            return redirect("/login", {
                headers: {
                    "Set-Cookie": await destroySession(session)
                }
            })
        } else {
            return json({ error: true, message: paymentsRes.message, data: undefined })
        }
    } catch(err) {
        // @ts-ignore
        return json({ error: true, message: err.message, data: undefined })
    }
}

export default function DashboardEventTiketListPage() {
    const data = useLoaderData<typeof loader>()
    console.log(data)
    const paymentRes: Page<PaymentTransactionResponse> | undefined = data.data.payments || undefined
    useEffect(() => {
        if (typeof paymentRes != "undefined") {
            console.log(paymentRes)
        }
    }, [paymentRes])
    const {eventRes} = useOutletContext<{eventRes: Event | undefined}>()
    return (
        <>
        <div className="space-y-3">
           <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">Payment Transactions</h1>
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
            <div className="border rounded-lg shadow-sm">
                <Table className="table-auto">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="">Total</TableHead>
                            <TableHead className="">Tanggal Pembelian</TableHead>
                            <TableHead className="">Nama Pembeli</TableHead>
                            <TableHead className="">Status</TableHead>
                            <TableHead className="">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paymentRes && paymentRes.content.length > 0 ? paymentRes.content.map((paymentItem) => {
                            return (
                                <TableRow>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <div className="ml-2 font-medium">Rp {paymentItem.total}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{handleDateTime(paymentItem.date)}</TableCell>
                                    <TableCell>
                                        {paymentItem.user}
                                    </TableCell>
                                    <TableCell>
                                        {paymentItem.status}
                                    </TableCell>
                                    <TableCell>
                                        <Button asChild size="icon" variant="outline">
                                            <Link to={`/dashboard/event/${eventRes?.uuid}/paymenttransaction/${paymentItem.uuid}`}>
                                                <Ellipsis size={16} />
                                                <span className="sr-only">See More</span>
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        }) : <>No Payment Transactions Found</>}
                    </TableBody>
                </Table> 
            </div> 
        </div> 
        </>
    )
}