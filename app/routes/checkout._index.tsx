import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect, redirectDocument } from "@remix-run/node";
import { useActionData, useFetcher, useLoaderData, useOutletContext, useRevalidator } from "@remix-run/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { NavBar } from "~/components/common/Navbar";
import { ICheckoutService } from "~/service/checkout/ICheckoutService";
import { Checkout } from '~/data/entity/checkout/Checkout'
import { ToastAction } from "@radix-ui/react-toast";
import { Minus, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { IPaymentService } from "~/service/payment/IPaymentService";
import { PaymentRequest } from "~/data/dto/payment/PaymentRequest";
import { ExternalScriptsHandle } from "remix-utils/external-scripts";
import { PaymentResponse as NgipenPaymentResponse, isPaymentResponse } from "~/data/dto/payment/PaymentResponse";
import { getAuthSession } from "~/utils/authUtil";
import { destroySession } from "~/sessions";
import { handleCurrency } from "~/utils/numberUtil";

export const loader = async ({request}: LoaderFunctionArgs) => {
    const checkoutService = new ICheckoutService()
    try {
        const res = await checkoutService.getCheckouts({request})
        console.log(res)
        if (res.status_code == 200) {
            return json({error: false, message: res.message, data: res.data})
        } else {
            return json({error: true, message: res.message, data: res.data})
        }
    } catch(err) {
        // @ts-ignore
        return json({error: true, message: err.message, data: {} as Checkout[]})
    }
}

export const action = async ({request}: ActionFunctionArgs) => {
    // console.log(await request.json(), request.method)
    const checkoutService = new ICheckoutService()
    const paymentService = new IPaymentService()
    try {
        const data = await request.json()
        if (data.key == "update-checkout") {
            console.log(data)
            const res = await checkoutService.updateCheckout({data: {uuid: data.data.uuid, total: data.data.total}, request})
            if (res.status_code == 200) {
                console.log(res)
                return json({error: false, message: res.message, data: {} as Checkout[]})
            } else if(res.status_code == 401) {
                const session = await getAuthSession(request)
                return redirect("/login", {
                    headers: {
                        "Set-Cookie": await destroySession(session)
                    }
                })
            } else {
                return json({error: true, message: res.message, data: {}})
            }
        } else if(data.key == "payment") {
            console.log(data)
            const dataPayment: PaymentRequest = {
                orders: data.data
            }
            const res = await paymentService.payment({data: dataPayment, request})
            if (res.status_code == 200) {
                return redirectDocument(`/payment/${res.data?.payment_transaction.uuid}`)
                // return json({error: false, message: res.message, data: res.data})
            } else if(res.status_code == 401) {
                const session = await getAuthSession(request)
                return redirect("/login", {
                    headers: {
                        "Set-Cookie": await destroySession(session)
                    }
                })
            } else {
                return json({error: true, message: res.message, data: {}})
            }
        } else {
            return json({error: true, message: "Failed actioning checkout", data: {}})
        }
    } catch(err) {
        // @ts-ignore
        return json({error: true, message: err.message, data: {} as Checkout[]})
    }
}

export default function CheckoutPage() {
    const loaderData = useLoaderData<typeof loader>()
    const actionData = useActionData<typeof action>()
    const {toast} = useToast()
    const revalidate = useRevalidator()
    const [checkoutData, setCheckoutData] = useState<Checkout[] | undefined>(loaderData.data)
    const [totalCost, setTotalCost] = useState(0)
    const snapScriptRef = useRef<HTMLScriptElement>()
    const updateFetcher = useFetcher<{error: boolean, message: string, data: Checkout[] | NgipenPaymentResponse}>({key: "update-checkout"})
    // useMemo(() => {

    // })
    const handleCountChange = async (data: {uuid: string, total: number}) => {
        updateFetcher.submit({key: "update-checkout",data: data}, {method: "POST", encType: "application/json"})
    }
    const handlePayment = (uuids: string[]) => {
        updateFetcher.submit({key: "payment", data: uuids}, {method: "POST", encType: "application/json"})
    }

    useEffect(() => {
        loaderData.error && toast({title: loaderData.message, variant: loaderData.error ? "destructive": "default", action: loaderData.error ? <ToastAction altText="Try Again" onClick={() => revalidate.revalidate()}>Try Again</ToastAction> : <></>})
    }, [loaderData])
    return (
        <div className="px-24 space-y-4">
            <NavBar />
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/checkout">Checkout</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-8 space-y-4">
                    {
                        loaderData.data && loaderData.data.length > 0 ? loaderData.data?.map(item => {
                            const countInc = item.total++
                            const countDec = item.total--
                            return (
                                <Card className="w-full">
                                    <CardHeader>
                                        <CardTitle>{item.event} - {item.jenisTiket.nama}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex justify-between items.center">
                                        <span>{handleCurrency(item.jenisTiket.harga)} x {item.total}</span>
                                        <div className="flex items-center">
                                            <Minus onClick={() => handleCountChange({uuid: item.uuid, total: item.total - 1})} size={32} className="bg-secondary p-1 rounded-sm" />
                                            <span className="py-2 px-4">{item.total}</span>
                                            <Plus onClick={() => handleCountChange({uuid: item.uuid, total: item.total + 1})} size={32} className="bg-secondary p-1 rounded-sm" />
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        }) : <div>No checkouts found!</div>
                    }
                </div>
                <div className="col-span-4">
                    <Card className="">
                        <CardHeader>
                            <CardTitle>Total</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {
                                loaderData.data && loaderData.data.length > 0 ? loaderData.data?.map(item => {
                                    return (
                                        <div key={item.uuid} className="flex justify-between pb-3 items-center">
                                            <p>{handleCurrency(item.jenisTiket.harga)} x {item.total}</p>
                                            <p>{handleCurrency(item.jenisTiket.harga * item.total)}</p>
                                        </div>
                                    )
                                }) : <></>
                            }
                            <Separator className="mb-3"/>
                            <div className="flex justify-between mb-3">
                                <div>Total</div>
                                <div>{handleCurrency(loaderData.data && loaderData.data.length > 0 ? loaderData.data?.reduce((countLast, item) => countLast + (item.jenisTiket.harga * item.total), 0) : 0)}</div>
                            </div>
                            <Button disabled={(loaderData.data || []).length <= 0 || updateFetcher.state == "loading" || updateFetcher.state == "submitting"} onClick={() => handlePayment(loaderData.data?.map<string>(item => item.uuid) || [])} className="w-full">Beli Sekarang</Button>
                         </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}