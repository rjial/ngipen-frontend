import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Link, useLoaderData, useNavigate, useRevalidator } from "@remix-run/react";
import { Calendar, CircleIcon, MapPin } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { NavBar } from "~/components/common/Navbar";
import { Page } from "~/data/entity/common/Page";
import { TiketItemListResponse } from "~/data/dto/ticket/TiketItemListResponse";
import { ITicketService } from "~/service/ticket/ITicketService";
import { destroySession } from "~/sessions";
import { getAuthSession, getAuthToken } from "~/utils/authUtil";
import { handleDate, handleDateTime } from "~/utils/dateUtil";
import { blobToBase64 } from "~/utils/fileUtil";
import { IPaymentService } from "~/service/payment/IPaymentService";
import { FetchClient } from "~/service/FetchClient.server";
import { EventSource as EventSourceEx } from "extended-eventsource"
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const ticketService = new ITicketService()
    const paymentService = new IPaymentService()
    try {
        const uuidTicket = params.uuid as string
        const res = await ticketService.getTiket({ uuid: uuidTicket, request: request })
        const qrRes = await ticketService.generateTiketQR(uuidTicket, request)
        if (res.status_code == 200) {
            const fetchClient = new FetchClient()
            const tiketStatusUrl = fetchClient.getURL(`/tiket/${uuidTicket}/status`)
            const paymentStatus = await paymentService.getPaymentTransactionPaymentGatewayStatus({uuidEvent: res.data?.paymentTransaction || ""}, request)
            const authToken = await getAuthToken(request)
            const base64 = await blobToBase64(qrRes)
            return json({ error: false, message: res.message, data: {tiket: res.data, qrData: base64, paymentStatus: paymentStatus.data, tiketStatusUrl: tiketStatusUrl, authToken: authToken} })
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
        // @ts-ignore
        return json({ error: true, message: err.message, data: undefined })
    }
}

export default function TiketPage() {
    const { error, message, data } = useLoaderData<typeof loader>()
    const { toast } = useToast()
    const imgQRRef = useRef<HTMLImageElement | null>(null)
    const imgQrId = useId()
    const navigate = useNavigate()
    let revalidator = useRevalidator();
    let transactionStatus: {[key: string]: string} = {}
    if (data?.paymentStatus != undefined) {
        transactionStatus = JSON.parse(data?.paymentStatus)
        console.log(transactionStatus)
    }
    
    const [qrCode, setQRCode] = useState(data.qrData)
    useEffect(() => {
        let eventSource: EventSourceEx | undefined = undefined
        if (error) toast({ title: message, variant: error ? "destructive" : "default" })
        if (data?.tiket != undefined && data?.tiket.statusVerifikasi == false) {
            eventSource = new EventSourceEx(data?.tiketStatusUrl, {
                headers: {
                    'Authorization': `Bearer ${data?.authToken}`
                },
            })

            eventSource.addEventListener("message", (event) => {
                console.log("Message : " + event.data)

            })

            if (eventSource != undefined) {
                eventSource.onmessage = (event) => {
                    console.log("Message : " + event.data)
                    if (event.data == "true") {
                        toast({title: "Validasi Tiket", description: "Tiket telah terverifikasi"})
                        eventSource?.close()
                        navigate('.', { replace: true })
                    }
                }

                eventSource.onopen = (event) => {
                    console.log('Connection opened');
                    console.log("Message : " + event.type)
                };

                eventSource.onerror = (error) => {
                    console.error('Error occurred:', error);
                };
            }
        }

        return () => {
            if (eventSource != undefined) {
                eventSource.close()
            }
        }
    }, [data])
    return (
        <div className="px-24">
            <NavBar />
            <Breadcrumb className="mt-10">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/tiket">Ticket</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/tiket/${data?.tiket.uuid}`}>{data?.tiket.uuid}</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="grid grid-cols-5 gap-6 mt-10">
                <Card className="w-full col-span-4">
                    <CardHeader>
                        <div className="flex items-center space-x-3">
                            <CardTitle>{data?.tiket.event}</CardTitle>
                            <Badge className={cn("bg-white dark:bg-gray-950 w-fit h-fit", data?.tiket.statusTiket ? "border-green-600" : "border-red-600")} variant="outline">
                                <CircleIcon className={cn("h-3 w-3 -translate-x-1 animate-pulse ", data?.tiket.statusTiket ? "fill-green-300 text-green-300" : "fill-red-300 text-red-300")} />
                                {data?.tiket.statusTiket ? "Terverifikasi" : "Belum Terverifikasi"}
                            </Badge>
                        </div>
                        <CardDescription>{handleDate(data?.tiket.date)} - ({data?.tiket.waktu_awal} - {data?.tiket.waktu_akhir})</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-gray-500 dark:text-gray-400">Ticket Type</p>
                                <p className="font-medium">{data?.tiket.jenisTiket}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-gray-500 dark:text-gray-400">Total</p>
                                <p className="font-medium">Rp {data?.tiket.price}</p>
                            </div>
                        </div>
                        <Separator className="my-4" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-gray-500 dark:text-gray-400">Lokasi</p>
                                <p className="font-medium">{data?.tiket.lokasi}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-gray-500 dark:text-gray-400">Total</p>
                                <p className="font-medium">{data?.tiket.statusVerifikasi ? "Terverifikasi" : "Belum Terverifikasi"}</p>
                            </div>
                        </div>
                        <Separator className="my-4" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-gray-500 dark:text-gray-400">Payment Transaction</p>
                                <div>
                                    <Link className="font-medium" to={`/payment-transaction/${data?.tiket.paymentTransaction}`}>#{data?.tiket.paymentTransaction}</Link>
                                </div>
                            </div>
                            {("transaction_time" in transactionStatus) ? (
                            <div className="space-y-1">
                                <p className="text-gray-500 dark:text-gray-400">Transaction Time</p>
                                <p className="font-medium">{handleDateTime(transactionStatus.transaction_time)}</p>
                            </div>
                            ): <></>}
                        </div>
                        <Separator className="my-4" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {("transaction_status" in transactionStatus) ? (
                            <div className="space-y-1">
                                <p className="text-gray-500 dark:text-gray-400">Transaction Status</p>
                                <p className="font-medium">{transactionStatus.transaction_status}</p>
                            </div>
                            ): <></>}
                            {("payment_type" in transactionStatus) ? (
                            <div className="space-y-1">
                                <p className="text-gray-500 dark:text-gray-400">Payment Type</p>
                                <p className="font-medium">{transactionStatus.payment_type}</p>
                            </div>
                            ): <></>}
                        </div>
                    </CardContent>
                    <CardFooter>
                    </CardFooter>
                </Card>
                <div className="">
                    <Card className="w-64 h-64 col-span-1 flex justify-center items-center">
                        <img src={data.qrData} id={imgQrId} />
                    </Card>
                </div>
            </div>
        </div>
    )
}