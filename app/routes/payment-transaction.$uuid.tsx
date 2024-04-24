
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { json, TypedResponse, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData, useOutletContext } from "@remix-run/react";
import { CircleIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { NavBar } from "~/components/common/Navbar";
import { IPaymentService } from "~/service/payment/IPaymentService";

export const meta: MetaFunction = () => {
    return [
        { title: "Ngipen - Payment Transaction" },
        { name: "description", content: "Welcome to Ngipen!" },
    ];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
    const paymentTransactionUUID = params.uuid as string
    const paymentService = new IPaymentService()
    // const paymentService = new IPaymentService()
    const res = await paymentService.getPayment({uuid: paymentTransactionUUID, request: request })
    // console.log(res)
    return json({ error: res.status_code == 200, message: res.message, data: res })
}

export default function Index() {
    const { data } = useLoaderData<typeof loader>()
    const snapScriptRef = useRef<HTMLScriptElement>()
    const handlePaymentProceed = async (snapToken: string) => {
        // @ts-ignore
        snap.pay(snapToken)
    }
    let statusCircleClass = ""
    let statusBadgeClass = ""
    switch (data.data?.status) {
        case "Waiting for verified":
            statusCircleClass = "fill-yellow-300 text-yellow-300"
            statusBadgeClass = "border-yellow-600"
            break
        default:
            statusCircleClass = "fill-green-300 text-green-300"
            statusBadgeClass = "border-green-600"
            break
    }
    useEffect(() => {
        if (data !== undefined) {
            console.log(data)
            const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
            if (snapScriptRef.current == undefined) {
                snapScriptRef.current = document.createElement('script');
                snapScriptRef.current.src = midtransScriptUrl
            }
            snapScriptRef.current.setAttribute('data-client-key', "SB-Mid-client-vCLfQi6IOtcCIumG")
            document.body.appendChild(snapScriptRef.current)
        }
        return () => {
            if (snapScriptRef.current != undefined) {
                document.body.removeChild(snapScriptRef.current)
                snapScriptRef.current = undefined
            }
        }
    }, [data])
    return (
        <div className="px-24 space-y-10">
            <NavBar />
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/payment-transaction">Payment Transactions</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild ><Link to={`/payment-transaction/${data.data?.uuid}`}>{data.data?.uuid}</Link></BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-3xl font-bold mb-8 text-center">Payment Transactions</h1>
            <div className="grid gap-6">
                <Card className="w-full">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div className="flex space-x-3 items-center">
                                <CardTitle>#{data.data?.uuid}</CardTitle>
                                <Badge className={cn("bg-white dark:bg-gray-950 w-fit h-fit", statusBadgeClass)} variant="outline">
                                    <CircleIcon className={cn("h-3 w-3 -translate-x-1 animate-pulse ", statusCircleClass)} />
                                    {data.data?.status}
                                </Badge>
                            </div>
                            <div className="flex gap-3">
                                <Button onClick={() => handlePaymentProceed(data.data?.snapToken as string)}>Proceed Payment</Button>
                                <Button variant="outline" asChild><Link to={`/payment/${data.data?.uuid}`}>Details</Link></Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>

                        <div className="space-y-2">
                            <div className="text-sm text-gray-500">{data.data?.date}</div>
                            <div className="text-lg font-medium">Rp {data.data?.total}</div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <div className="flex flex-col gap-4">
                            {data.data?.paymentTransactions && data.data?.paymentTransactions.length > 0 && data.data?.paymentTransactions.map((paymentTransactionItem) => {
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
        </div>
    );
}
