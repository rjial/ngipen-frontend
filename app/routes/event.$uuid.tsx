import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Link, useActionData, useFetcher, useLoaderData, useOutletContext, useSubmit } from "@remix-run/react";
import { Calendar, CalendarIcon, MapPin, Minus, Plus, Slash } from "lucide-react";
import { NavBar } from "~/components/common/Navbar";
import { IEventService } from "~/service/events/IEventService.server";
import dayjs from "dayjs"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useMemo, useState } from "react";
import { JenisTiket, JenisTiketCount } from "~/data/entity/events/JenisTiket";
import { Button } from "@/components/ui/button";
import { IOrderService } from "~/service/order/IOrderService";
import invariant from 'tiny-invariant'
import { OrderDataRequest, OrderItemRequest } from "~/data/dto/order/OrderRequest";
import { handleDate } from "~/utils/dateUtil";
import { useToast } from "@/components/ui/use-toast";
import {
    PayloadLexicalReactRenderer,
    PayloadLexicalReactRendererProps,
    PayloadLexicalReactRendererContent
} from "@atelier-disko/payload-lexical-react-renderer";
import { UserClaim } from "~/data/entity/auth/UserClaim";

export const loader = async ({ params }: LoaderFunctionArgs) => {
    try {
        const uuidEvent = params.uuid as string
        const eventService = new IEventService()
        const data = await eventService.getEvent(uuidEvent)
        const dataJenisTiket = await eventService.getJenisTiket(uuidEvent)
        if (data.status_code == 200) {
            console.log(dataJenisTiket.data)
            return json({event: data.data, jenisTiket: dataJenisTiket.data})
        } else {
            throw new Response(`Failed to load event! : ${data.message}`, {
                status: data.status_code
            })
        }
    } catch(err) {
        // @ts-ignore
        throw new Response(`Failed to load event! : ${err?.message}`, {
            status: 500
        })
    }
}

export const action = async ({request, params}: ActionFunctionArgs) => {
    try {
        const uuid = params.uuid || ""
        const orderService = new IOrderService(request)
        const data = await request.json() as OrderDataRequest
        const res = await orderService.order({uuid: uuid}, {orders: data.orders})
        if (res.status_code == 200) {
            return redirect("/checkout")
            // return json({error: false, message: "", data: res})
        } else {
            return json({error: true, message: res.message, data: {}})
        }
    } catch(err) {
        // @ts-ignore
        return json({error: true, message: err.message, data: {}})
    }
}

export default function EventItemPage() {
    const actionData = useActionData<typeof action>()
    const submit = useSubmit()
    const {user} = useOutletContext<{user: UserClaim | undefined, checkoutCount: number}>()
    const toast = useToast()
    const {event, jenisTiket} = useLoaderData<typeof loader>()
    const [showBuyButton, setShowBuyButton] = useState(false)
    const [jenisTiketCount, setJenisTiketCount] = useState(jenisTiket?.map(item => new JenisTiketCount(item)))
    const contentDesc = JSON.parse(event?.desc!) as PayloadLexicalReactRendererContent
    const handleIncrementCount = (id: number) => {
        const data = jenisTiketCount?.map(i => {
            if (i.jenistiket == id) {
                console.log(i)
                return {
                    ...i,
                    count: i.count + 1
                }
            } else {
                return i
            }
        }) as JenisTiketCount[]
        setJenisTiketCount(data)
    }
    const handleDecrementCount = (id: number) => {
        const data = jenisTiketCount?.map(i => {
            if (i.jenistiket == id) {
                console.log(i)
                if (i.count == 0) return i
                return {
                    ...i,
                    count: i.count - 1
                }
            } else {
                return i
            }
        }) as JenisTiketCount[]
        setJenisTiketCount(data)
    }
    const handleClear = () => {
        setJenisTiketCount(jenisTiket?.map(item => new JenisTiketCount(item)))
    }
    const handleSubmitBeli = (data: JenisTiketCount[]) => {
        const newData = data.filter(item => item.count > 0).map<OrderItemRequest>((item) => {
            return {total: item.count, jenisTiket: item.jenistiket}
        })
        // @ts-ignore
        submit({orders: newData}, { method: "POST", encType: "application/json" })
        handleClear()
    }
    const [total, setTotal] = useState(0)
    useMemo(() => {
        const finalData = jenisTiketCount?.map(item => {
            const data = jenisTiket?.find(tiket => tiket.id == item.jenistiket) as JenisTiket
            return {idJenisTiket: data.id, harga: data.harga, count: item.count}
        })
        const finalHarga = finalData?.reduce((countLast, item) => countLast + (item.harga * item.count), 0) || 0
        setTotal(finalHarga)
    }, [jenisTiketCount, jenisTiket])
    useEffect(() => {
        const sumCount = jenisTiketCount?.reduce((countLast, item) => countLast + item.count, 0) || 0
        if (sumCount > 0) {
            setShowBuyButton(true)
        } else {
            setShowBuyButton(false)
        }
    }, [jenisTiketCount])
    useEffect(() => {
        if (actionData != undefined) {
            if(actionData.error) toast.toast({title: actionData.message, variant: "destructive"})
        }
    }, [actionData])
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
                        <BreadcrumbLink href="/event">Event</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/event/${event?.uuid}`}>{event?.name}</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex flex-col justify-center items-center pt-10 space-y-5">
                <span className="font-semibold text-4xl">{event?.name}</span>
                <div className="flex flex-row space-x-5">
                    <div className="flex flex-row space-x-3"><Calendar className="text-sm" /><span>{handleDate(new Date(event?.tanggal_awal as string))}</span></div>
                    <div className="flex flex-row space-x-3"><MapPin className="text-sm" /><span>{event?.lokasi}</span></div>
                </div>
            </div>
            <img src="https://source.unsplash.com/U7HLzMO4SIY" alt="lorem ipsum" className="w-full h-96 rounded-lg object-cover"/>
            <div className="w-full flex justify-center">
                <span className="font-semibold text-2xl">Choose your ticket!</span>
            </div>
            <div className="flex flex-row justify-around w-full">
                
                {jenisTiket !== undefined ? jenisTiket.map((item, index) => {
                    const count = jenisTiketCount?.find(data => item.id == data.jenistiket)
                    return (
                    <Card key={item.id} className="w-72">
                        <CardHeader>
                            <CardTitle>{item.nama}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ol>
                                <li>lorem ipsum</li>
                            </ol>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <span>{item.harga}</span>
                            <div className="flex items-center">
                                <Minus onClick={() => handleDecrementCount(item.id as number)} size={32} className="bg-secondary p-1 rounded-sm"/>
                                <span className="py-2 px-4">{count?.count}</span>
                                <Plus onClick={() => handleIncrementCount(item.id as number)} size={32} className="bg-secondary p-1 rounded-sm"/>
                            </div>
                        </CardFooter>
                    </Card>
                )}) : <span>Loading</span>}
            </div>
            { showBuyButton ?
                <div className="w-full">
                    <Card className="flex justify-between p-6 items-center">
                        <span className="font-semibold text-xl">Rp {total}</span>
                        <div className="flex space-x-3">
                            {user != undefined ? 
                            <>
                                <Button variant="secondary" onClick={() => handleClear()}>Clear</Button>
                                <Button onClick={() => handleSubmitBeli(jenisTiketCount || [])}>Beli</Button>
                            </> : <>
                                <Button variant="default" asChild><Link to="/login">Login To Buy</Link></Button>
                            </>}
                        </div>
                    </Card>
                </div> : <></>}
            <div  className="pt-8">
                <p className="text-justify text-wrap break-all">
                    <PayloadLexicalReactRenderer content={contentDesc} />
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                    <span className="font-semibold text-xl">Event Organizer</span>
                    <Card>
                        <div className="flex justify-center space-x-4 p-6">
                            <Avatar>
                                <AvatarImage src="https://github.com/vercel.png" />
                                <AvatarFallback>VC</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1 flex-1">
                                <h4 className="text-sm font-semibold">{event?.pemegangEvent}</h4>
                                <p className="text-sm">
                                    The React Framework – created and maintained by @vercel.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="space-y-4">
                    <span className="font-semibold text-xl">Event Location</span>
                    <div className="w-full h-fit">
                        <img src="https://i.imgur.com/SDO3eDZ.png" alt="map location" className="w-full object-cover rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    )
}