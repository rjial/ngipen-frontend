
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { json, TypedResponse, type LoaderFunctionArgs, type MetaFunction, redirect } from "@remix-run/node";
import { ClientActionFunctionArgs, ClientLoaderFunctionArgs, Link, useLoaderData, useOutletContext } from "@remix-run/react";
import { CheckCircleIcon, CheckIcon, CircleIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { NavBar } from "~/components/common/Navbar";
import { PaymentHistory } from "~/data/dto/payment/PaymentHistory";
import { PaymentTransactionResponse } from "~/data/dto/payment/PaymentTransactionResponse";
import { IPaymentService } from "~/service/payment/IPaymentService";
import { destroySession } from "~/sessions";
import { getAuthSession } from "~/utils/authUtil";
import { handleDate, handleDateTime } from "~/utils/dateUtil";
import { handleCurrency } from "~/utils/numberUtil";

export const meta: MetaFunction = () => {
    return [
        { title: "Ngipen - Payment Transaction" },
        { name: "description", content: "Welcome to Ngipen!" },
    ];
};

interface DataLoaderFromPaymentRedirect {
    payment: string,
    status_code: number,
    transaction_status: string
}

interface DataLoaderPaymentTransactionInformation {
    
}

interface DataLoaderPaymentTransaction {
    payment: PaymentTransactionResponse,
    fromPaymentRedirect: DataLoaderFromPaymentRedirect | undefined,
    paymentHistories: PaymentHistory[],
    paymentStatus: string
}

export async function loader({ request, params }: LoaderFunctionArgs) {
    const paymentTransactionUUID = params.uuid as string
    const paymentService = new IPaymentService()
    const url = new URL(request.url)
    const statusCodeTransactionRedirect = Number(url.searchParams.get("status_code") || 0)
    const statusTransactionRedirect = url.searchParams.get("transaction_status") || undefined
    let dataLoaderFromPaymentRedirect: DataLoaderFromPaymentRedirect | undefined = undefined
    if (statusCodeTransactionRedirect != undefined && statusTransactionRedirect != undefined) {
        dataLoaderFromPaymentRedirect = {payment: paymentTransactionUUID, status_code: statusCodeTransactionRedirect, transaction_status: statusTransactionRedirect}
    }
    // const paymentService = new IPaymentService()
    try {
        const res = await paymentService.getPayment({uuid: paymentTransactionUUID, request: request })
        // console.log(res)
        if(res.status_code == 401) {
            const session = await getAuthSession(request)
            return redirect("/login", {
                headers: {
                    "Set-Cookie": await destroySession(session)
                }
            })
        }
        const statusRes = await paymentService.getPaymentTransactionPaymentGatewayStatus({uuidEvent: paymentTransactionUUID}, request)
        let status: string | undefined = undefined
        const historiesRes = await paymentService.getPaymentTransactionHistories({uuidEvent: paymentTransactionUUID}, request)
        let histories: PaymentHistory[] | undefined = undefined
        if (statusRes.status_code == 200) {
            status = statusRes.data
        }
        if (historiesRes.status_code == 200) {
            histories = historiesRes.data
        }
        return json({ error: false, message: res.message, data: {payment: res.data, fromPaymentRedirect: dataLoaderFromPaymentRedirect, paymentHistories: histories, paymentStatus: status} })
    } catch(err) {
        if (err instanceof Error) {
            return json({ error: true, message: err.message, data: undefined })
        }
        console.error(err)
        return json({ error: true, message: undefined, data: undefined })
    }
}

// export const clientLoader = async ({request, params, serverLoader}: ClientLoaderFunctionArgs) => {
//     try {
//         const paymentService = new IPaymentService()
//         const serverData = await serverLoader<{error: boolean, message: string | undefined, data: DataLoaderPaymentTransaction | undefined}>()
//         if (serverData.error) {
//             return serverData
//         } else {
//             const statusRes = await paymentService.getPaymentTransactionPaymentGatewayStatus({uuidEvent: serverData.data?.payment.uuid || "-"}, request)
//             let status: string | undefined = undefined
//             const historiesRes = await paymentService.getPaymentTransactionHistories({uuidEvent: serverData.data?.payment.uuid || "-"}, request)
//             let histories: PaymentHistory[] | undefined = undefined
//             if (statusRes.status_code == 200) {
//                 status = statusRes.data
//             }
//             if (historiesRes.status_code == 200) {
//                 histories = historiesRes.data
//             }
//             return {...serverData, data: {...serverData.data, paymentHistories: histories, paymentStatus: status}}
//         }
//     } catch(err) {
//         console.error(err)
//         if (err instanceof Error) {
//             return json({error: true, message: err.message, data: undefined})
//         } else {
//             return json({error: true, message: undefined, data: undefined})
//         }
//     }

// }
// clientLoader.hydrate = true;

// export function HydrateFallback() {
//     return <p>Skeleton rendered during SSR</p>; // (2)
// }

export default function Index() {
    const dataLoader = useLoaderData<{ error: boolean, message: string | undefined, data: DataLoaderPaymentTransaction | undefined }>()
    const snapScriptRef = useRef<HTMLScriptElement>()
    let statusCircleClass = ""
    let statusBadgeClass = ""
    let transactionStatus: {[key: string]: string} = {}
    console.log(dataLoader)
    if (dataLoader != undefined) {
        if (!dataLoader.error) {
            switch (dataLoader.data?.payment.status) {
                case "Waiting for verified":
                    statusCircleClass = "fill-yellow-300 text-yellow-300"
                    statusBadgeClass = "border-yellow-600"
                    break
                default:
                    statusCircleClass = "fill-green-300 text-green-300"
                    statusBadgeClass = "border-green-600"
                    break
            }
            transactionStatus = JSON.parse(dataLoader.data?.paymentStatus || "{}")
        }
    }
    // useEffect(() => {
    //     if (data !== undefined) {
    //         console.log(data)
    //         const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
    //         if (snapScriptRef.current == undefined) {
    //             snapScriptRef.current = document.createElement('script');
    //             snapScriptRef.current.src = midtransScriptUrl
    //         }
    //         snapScriptRef.current.setAttribute('data-client-key', "SB-Mid-client-vCLfQi6IOtcCIumG")
    //         document.body.appendChild(snapScriptRef.current)
    //     }
    //     return () => {
    //         if (snapScriptRef.current != undefined) {
    //             document.body.removeChild(snapScriptRef.current)
    //             snapScriptRef.current = undefined
    //         }
    //     }
    // }, [data])
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
                        <BreadcrumbLink href="/payment-transaction">Payment Transactions</BreadcrumbLink>
                    </BreadcrumbItem>
                    {dataLoader.error ? <></> : (
                        <>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild ><Link to={`/payment-transaction/${dataLoader.data?.payment.uuid}`}>{dataLoader.data?.payment.uuid}</Link></BreadcrumbLink>
                            </BreadcrumbItem>
                        </>
                    )}

                </BreadcrumbList>
            </Breadcrumb>
            {dataLoader.error ? <><p>{dataLoader.message}</p></> : (
                <>
                    {dataLoader.data?.fromPaymentRedirect && dataLoader.data.fromPaymentRedirect != undefined ? (
                        <>
                            <AlertDialog defaultOpen={true}>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogHeader>
                                            <CheckCircleIcon size={32} className="text-green-500 " />
                                            <AlertDialogTitle>Success!</AlertDialogTitle>
                                            <AlertDialogDescription>Your payment transaction was completed successfully.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogAction>OK</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
                    ) : <></>}
                    <h1 className="text-3xl font-bold mb-8 text-center mt-10">Payment Transactions</h1>
                    <div className="grid gap-6">
                        <Card className="w-full">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-3 items-center">
                                        <CardTitle>#{dataLoader.data?.payment.uuid}</CardTitle>
                                        <Badge className={cn("bg-white dark:bg-gray-950 w-fit h-fit", statusBadgeClass)} variant="outline">
                                            <CircleIcon className={cn("h-3 w-3 -translate-x-1 animate-pulse ", statusCircleClass)} />
                                            {dataLoader.data?.payment.status}
                                        </Badge>
                                    </div>
                                    <div className="flex gap-3">
                                        {dataLoader.data?.payment.status != "Accepted" ? <Button asChild><Link to={`/payment/${dataLoader.data?.payment.uuid}`}>Proceed Payment</Link></Button> : <></>}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">

                                <div className="space-y-2">
                                    <div className="text-sm text-gray-500">{handleDateTime(dataLoader.data?.payment.date)}</div>
                                    <div className="text-lg font-medium">{handleCurrency(dataLoader.data?.payment.total || 0)}</div>
                                </div>
                                <hr className="" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                                    {("transaction_status" in transactionStatus) ? (
                                        <div className="space-y-1">
                                            <div className="text-gray-500">Transaction Status</div>
                                            <div className="font-medium">{transactionStatus.transaction_status}</div>
                                        </div>
                                    ): <></>}
                                    {("transaction_time" in transactionStatus) ? (
                                        <div className="space-y-1">
                                            <div className="text-gray-500">Transaction Time</div>
                                            <div className="font-medium">{handleDateTime(transactionStatus.transaction_time)}</div>
                                        </div>
                                    ): <></>}
                                    {("settlement_time" in transactionStatus) ? (
                                        <div className="space-y-1">
                                            <div className="text-gray-500">Settlement Time</div>
                                            <div className="font-medium">{handleDateTime(transactionStatus.settlement_time)}</div>
                                        </div>
                                    ): <></>}
                                    {("payment_type" in transactionStatus) ? (
                                        <div className="space-y-1">
                                            <div className="text-gray-500">Payment Type</div>
                                            <div className="font-medium">{transactionStatus.payment_type}</div>
                                        </div>
                                    ): <></>}
                                    {("acquirer" in transactionStatus) ? (
                                        <div className="space-y-1">
                                            <div className="text-gray-500">Acquirer</div>
                                            <div className="font-medium">{transactionStatus.acquirer}</div>
                                        </div>
                                    ): <></>}
                                    {("issuer" in transactionStatus) ? (
                                        <div className="space-y-1">
                                            <div className="text-gray-500">Issuer</div>
                                            <div className="font-medium">{transactionStatus.issuer}</div>
                                        </div>
                                    ): <></>}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <div className="flex flex-col gap-4">
                                    {dataLoader.data?.payment.paymentTransactions && dataLoader.data?.payment.paymentTransactions.length > 0 && dataLoader.data?.payment.paymentTransactions.map((paymentTransactionItem) => {
                                        return (
                                            <div className="flex items-center gap-4">
                                                <img
                                                    alt="Ticket"
                                                    className="rounded-md"
                                                    height={64}
                                                    src="https://source.unsplash.com/U7HLzMO4SIY"
                                                    style={{
                                                        aspectRatio: "64/64",
                                                        objectFit: "cover",
                                                    }}
                                                    width={64}
                                                />
                                                <div>
                                                    <div className="text-sm text-gray-500">{paymentTransactionItem.jenisTiket.nama}</div>
                                                    <div className="text-base font-medium">{paymentTransactionItem.event} (Rp {paymentTransactionItem.jenisTiket.harga} x {paymentTransactionItem.total})</div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                    
                    <h1 className="text-xl font-bold mt-8">Payment Histories</h1>
                    <div className="flex flex-row space-y-4 mt-4">
                        {dataLoader.data?.paymentHistories && dataLoader.data?.paymentHistories.map((historyItem) => (
                            <Card className="w-full">
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <div className="flex space-x-3 items-center">
                                            <CardTitle>{historyItem.event} - {historyItem.jenisTiket.nama}</CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="text-sm text-gray-500">{handleDate(dataLoader.data?.payment.date)}</div>
                                        <div className="text-lg font-medium">{handleCurrency(historyItem.jenisTiket.harga * historyItem.total)} ({handleCurrency(historyItem.jenisTiket.harga)} x {historyItem.total}) </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}