import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { useToast } from "@/components/ui/use-toast"
import { ActionFunctionArgs, LoaderFunctionArgs, SerializeFrom, json, redirect, redirectDocument } from "@remix-run/node"
import { useActionData, useFetcher, useLoaderData } from "@remix-run/react"
import { useEffect, useRef, useState } from "react"
import { NavBar } from "~/components/common/Navbar"
import { PaymentTransactionResponse } from "~/data/dto/payment/PaymentTransactionResponse"
import { IPaymentService } from "~/service/payment/IPaymentService"
import { destroySession } from "~/sessions"
import { getAuthSession } from "~/utils/authUtil"
import { PaymentResponse, isPaymentResponse } from "~/data/dto/payment/PaymentResponse";
import { ExternalScriptsHandle } from "remix-utils/external-scripts";

export const action = async ({request}: ActionFunctionArgs) => {
    const paymentService = new IPaymentService()
    try {
        const data: {key: string, data: any} = await request.json()
        if (data.key == "do-pay") {
            const payload: {key: string, data: {uuid: string}} = data
            console.log(data)
            const res = await paymentService.pay({uuid: payload.data.uuid, request: request})
            if (res.status_code == 200) {
                console.log(res)
                if ((res.data?.payment_transaction.total || 0) > 0) {
                    return json({ error: false, message: res.message, data: {key: data.key, data: res.data} , key: data.key})
                } else {
                    return redirectDocument(`/payment-transaction/${res.data?.payment_transaction.uuid}?status_code=200&transaction_status=settlement`)
                }
            } else if(res.status_code == 401) {
                const session = await getAuthSession(request)
                return redirect("/login", {
                    headers: {
                        "Set-Cookie": await destroySession(session)
                    }
                })
            } else {
                return json({ error: true, message: res.message, data: undefined , key: "error"})
            }
        } else {
            return json({ error: true, message: "No Key Found!", data: undefined , key: "error"})
        }
    } catch (err) {
        if (err instanceof Error) {
            return json({ error: true, message: err.message, data: undefined , key: "error"})
        } else {
            // @ts-ignore
            return json({ error: true, message: err.message, data: undefined , key: "error"})
        }
    }
}

export const loader = async ({request, params}: LoaderFunctionArgs) => {
    const uuid = params.uuid || ""
    console.log(uuid)
    const paymentService = new IPaymentService()
    try {
        const res = await paymentService.getPayment({uuid: uuid, request: request})
        if(res.status_code == 200) {
            return json({error: false, message: res.message, data: res.data, key: "load"})
        } else if(res.status_code == 401) {
            const session = await getAuthSession(request)
            return redirect("/login", {
                headers: {
                    "Set-Cookie": await destroySession(session)
                }
            })
        } else {
            return json({error: true, message: res.message, data: undefined, key: "error"})
        }
        console.log(res)
    } catch(err) {
        if (err instanceof Error) {
            return json({error: true, message: err.message, data: undefined, key: "error"})
        } else {
            // @ts-ignore
            return json({error: true, message: err.message, data: undefined, key: "error"})
        }
    }
    // return json({})
}

export default function PaymentIndexPage() {
    const dataAction = useActionData<typeof action>()
    const dataLoader = useLoaderData<typeof loader>()
    // const snapRef = useRef<HTMLScriptElement | null>(null)
    const fetcher = useFetcher()
    const {toast} = useToast()
    const [isError, setIsError] = useState(false)
    const [isPaymentError, setIsPaymentError] = useState(false)
    const handlePayment = (uuid: string) => {
        fetcher.submit({key: "do-pay", data: {uuid: uuid}}, {method: "POST", encType: "application/json"})
    }

    useEffect(() => {
        if (dataLoader.error) {
            setIsError(true)
        } else {
            setIsError(false)
            if (dataLoader.key == "load") {
                const data: PaymentTransactionResponse = dataLoader.data
                handlePayment(data.uuid)
            }
        }
    }, [])
    useEffect(() => {
        const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
        let snapScript = document.createElement('script');
        snapScript.src = midtransScriptUrl;
        document.body.appendChild(snapScript);
        if (fetcher.data != null) {
            const dataFetcher = fetcher.data as { error: boolean, message: string, data: {key: string, data: any} | undefined, key: string }
            if (dataFetcher.error) {
                toast({title: dataFetcher.message, variant: "destructive"})
            } else {
                if (dataFetcher.key == "do-pay") {
                    if (isPaymentResponse(dataFetcher.data?.data)) {
                        let snapScriptElement = document.querySelector<HTMLScriptElement>(`script[src="${midtransScriptUrl}"]`)
                        snapScriptElement?.setAttribute('data-client-key', dataFetcher.data?.data.client_key);
                        console.log(dataFetcher.data.data)
                        setTimeout(() => {
                            // @ts-ignore
                            window.snap.pay(dataFetcher.data.data.snap_token)
                        }, 3000)
                    }
                }
            }
            // if (dataFetcher?.error) {
            //     toast({title: dataFetcher.message, variant: "destructive"})
            // } else {
            //     if (dataFetcher?.data != undefined) {
            //         const payload: {key: string, data: any} = dataFetcher.data 
            //         if (payload != undefined) {
            //             if (payload.key == "do-pay") {
            //                 const data: PaymentResponse = payload.data
            //                 let snapScriptElement = document.querySelector<HTMLScriptElement>(`script[src="${midtransScriptUrl}"]`)
            //                 console.log(snapScriptElement)
            //                 snapScriptElement?.setAttribute('data-client-key', data.client_key);
            //                 // @ts-ignore
            //                 window.snap.pay(data.snap_token)
            //             } else {
            //                 toast({title: "Invalid fetcher!", variant: "destructive"})
            //             }
            //         } else {
            //             toast({title: "Payload is undefined!", variant: "destructive"})
            //         }
            //     } else {
            //         toast({title: "Action is undefined!", variant: "destructive"})
            //     }
            // }
        }
        return () => {
            document.body.removeChild(snapScript)
        }
    }, [fetcher.data])
    return (
        <div className="px-24 space-y-10 min-h-screen">
            <NavBar />
            <div className="flex justify-center items-center w-full h-dvh">
                <span className="">Loading Payment</span>
            </div>
        </div>
    )
}