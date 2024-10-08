
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { json, TypedResponse, type LoaderFunctionArgs, type MetaFunction, redirect, redirectDocument } from "@remix-run/node";
import { Link, useLoaderData, useOutletContext } from "@remix-run/react";
import { CircleIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { NavBar } from "~/components/common/Navbar";
import { PaymentTransactionResponse } from "~/data/dto/payment/PaymentTransactionResponse";
import { IPaymentService } from "~/service/payment/IPaymentService";
import { destroySession } from "~/sessions";
import { getAuthSession } from "~/utils/authUtil";
import { handleDateTime } from "~/utils/dateUtil";
import { handleCurrency } from "~/utils/numberUtil";

export const meta: MetaFunction = () => {
    return [
        { title: "Ngipen - Payment Transaction" },
        { name: "description", content: "Welcome to Ngipen!" },
    ];
};

export async function loader({ request }: LoaderFunctionArgs) {
    try {
        const url = new URL(request.url)
        const uuidTransactionRedirect = url.searchParams.get("order_id") || undefined
        if (uuidTransactionRedirect != undefined) {
            const statusCodeTransactionRedirect = Number(url.searchParams.get("status_code") || 0)
            if ( statusCodeTransactionRedirect > 0) {
                const statusTransactionRedirect = url.searchParams.get("transaction_status") || undefined
                if (statusTransactionRedirect != undefined) {
                    return redirectDocument(`/payment-transaction/${uuidTransactionRedirect}?status_code=${statusCodeTransactionRedirect}&transaction_status=${statusTransactionRedirect}`)
                }
            }
        }
        const paymentService = new IPaymentService()
        const res = await paymentService.getPayments({ request })
        console.log(res)
        if (res.status_code == 200) {
            return {
                error: false,
                message: res.message,
                data: res.data
            }
        } else if(res.status_code == 401) {
            const session = await getAuthSession(request)
            return redirect("/login", {
                headers: {
                    "Set-Cookie": await destroySession(session)
                }
            })
        } else {
            return {
                error: true,
                message: res.message,
                data: undefined
            }
        }

    } catch(err) {
        if (err instanceof Error) {
            return {
                error: true,
                message: err.message,
                data: undefined
            }
        } else {
            return {
                error: true,
                // @ts-ignore
                message: err.message,
                data: undefined
            }
        }
    }
    // return json({ error: res.status_code == 200, message: res.message, data: res.data })
}

export default function Index() {
    const { data } = useLoaderData<{error: boolean, message: string, data: PaymentTransactionResponse[]}>()
    const snapScriptRef = useRef<HTMLScriptElement>()
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
                </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-3xl font-bold mb-8 text-center">Payment Transactions</h1>
            <div className="grid gap-6">
                {data != undefined && data.length > 0 && data.map((paymentItem) => {
                    let statusCircleClass = ""
                    let statusBadgeClass = ""
                    switch (paymentItem.status) {
                        case "Waiting for verified":
                            statusCircleClass = "fill-yellow-300 text-yellow-300"
                            statusBadgeClass = "border-yellow-600"
                            break
                        default:
                            statusCircleClass = "fill-green-300 text-green-300"
                            statusBadgeClass = "border-green-600"
                            break
                    }
                    return (
                        <Card className="w-full">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-3 items-center">
                                        <CardTitle>#{paymentItem.uuid}</CardTitle>
                                        <Badge className={cn("bg-white dark:bg-gray-950 w-fit h-fit", statusBadgeClass)} variant="outline">
                                            <CircleIcon className={cn("h-3 w-3 -translate-x-1 animate-pulse ", statusCircleClass)} />
                                            {paymentItem.status}
                                        </Badge>
                                    </div>
                                    <div className="flex gap-3">
                                        {paymentItem.status != "Accepted" ? <Button asChild><Link to={`/payment/${paymentItem.uuid}`}>Proceed Payment</Link></Button> : <></>}
                                        <Button variant="outline" asChild><Link to={`/payment-transaction/${paymentItem.uuid}`}>Details</Link></Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>

                                <div className="space-y-2">
                                    <div className="text-sm text-gray-500">{handleDateTime(paymentItem.date)}</div>
                                    <div className="text-lg font-medium">{handleCurrency(paymentItem.total)}</div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <div className="flex flex-col gap-4">
                                    {paymentItem.paymentTransactions && paymentItem.paymentTransactions.length > 0 && paymentItem.paymentTransactions.map((paymentTransactionItem) => {
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
                    )
                })}
            </div>
        </div>
    );
}
