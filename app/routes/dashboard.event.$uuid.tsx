import { AlertDialog, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Link, NavLink, Outlet, useActionData, useFetcher, useLoaderData, useLocation, useMatches, useNavigation } from "@remix-run/react";
import { ArrowLeft, CalendarDaysIcon, Pencil, PencilIcon, Plus, ScanLine, SearchIcon, Trash, UserPlusIcon } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { UserItem } from "~/data/entity/auth/User";
import { Page } from "~/data/entity/common/Page";
import { Event } from "~/data/entity/events/Event";
import { JenisTiket } from "~/data/entity/events/JenisTiket";
import { IEventService } from "~/service/events/IEventService.server";
import { IUserService } from "~/service/user/IUserService";
import { destroySession } from "~/sessions";
import { getAuthSession } from "~/utils/authUtil";
import { handleDate } from "~/utils/dateUtil";
import { levelName } from "~/utils/levelUtil";
import { BarcodeScanner } from '@alzera/react-scanner';
import { ITicketService } from "~/service/ticket/ITicketService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const eventService = new IEventService()
    try {
        const eventUuid = params.uuid || ""
        const eventRes = await eventService.getEvent(eventUuid, request)
        if (eventRes.status_code == 200) {
            return json({ error: false, message: eventRes.message, data: {event: eventRes.data} })
        } else if(eventRes.status_code == 401) {
            const session = await getAuthSession(request)
            return redirect("/login", {
                headers: {
                    "Set-Cookie": await destroySession(session)
                }
            })
        } else {
            return json({ error: true, message: eventRes.message, data: undefined })
        }
    } catch(err) {
        // @ts-ignore
        return json({ error: true, message: err.message, data: undefined })
    }
}

export const action = async ({request}: ActionFunctionArgs) => {
    const jsonPayload: {key: string, data: any} = await request.json()
    try {
        switch(jsonPayload.key) {
            case "scan-qr":
                const ticketService = new ITicketService()
                const res = await ticketService.scanTiketQR(jsonPayload.data, request)
                console.log(res)
                if (res.status_code == 200) {
                    return json({error: true, message: res.message, data: res.data})
                } else {
                    throw new Error(res.message)
                }
            default:
                console.log(jsonPayload)
                return json({error: true, message: "Default case", data: undefined})
        }
    } catch (err) {
        if (err instanceof Error) {
            return json({error: true, message: err.message, data: undefined})
        } else {
            console.error(err)
        }
    }
}

export default function DashboardEventDetailPage() {
    const data = useLoaderData<typeof loader>()
    const actionData = useActionData<typeof action>()
    const matches = useMatches()
    const routeName = matches.at(-1)?.id.split(".").slice(3)[0]
    useEffect(() => {
        if (matches != undefined) console.log(matches.at(-1)?.id.split(".").slice(3))
    }, [matches])
    // const { search } = useLocation()
    // const page = new URLSearchParams(search).get("page")
    const eventRes: Event | undefined = data.data.event || undefined
    const jenisTiketRes: JenisTiket[] | undefined = data.data.jenisTiket || undefined
    const { toast } = useToast()
    const [qrRead, setQRRead] = useState("Not Found")
    const [modal, setModal] = useState<boolean>(false)
    const scanFetcher = useFetcher<typeof action>()
    const dataContext = {eventRes}
    const navigation = useNavigation()
    // if (data != undefined) {
    //     toast({ title: data.message, variant: data.error ? "destructive" : "default" })
    // }
    const handlingOpenQR = (open: boolean) => {
        setQRRead("")
        setModal(open)
    }
    const handlingQRRead = (dataQR: string) => {
        setQRRead(dataQR)
        const dataPayload = {
            payload: dataQR
        }
        console.log(dataPayload)
        handlingOpenQR(false)
        scanFetcher.submit({key: "scan-qr", data: dataPayload}, {method: "POST", encType: "application/json"})
        if (scanFetcher.state == "submitting") {
            console.log(scanFetcher.data)
            handlingOpenQR(false)
        }
        //process
    }
    // useEffect(() => {
    //     if (data != undefined) {
    //         toast({ title: data.message, variant: data.error ? "destructive" : "default" })
    //     }
    // }, [data])
    useEffect(() => {
        if (scanFetcher.data != undefined) {
            toast({ title: scanFetcher.data.message, variant: scanFetcher.data.error ? "destructive" : "default" })
        }
    }, [scanFetcher.data])
    return (
        <main className="flex flex-col w-full gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button asChild size="icon" variant="outline">
                        <Link to="/dashboard/event">
                            <ArrowLeft size={16} />
                            <span className="sr-only">Back</span>
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Event Details</h1>
                </div>
                <div className="flex items-center gap-2">
                    <AlertDialog open={modal} onOpenChange={(open) => handlingOpenQR(open)}>
                        <AlertDialogTrigger asChild>
                            <Button size="icon" variant="outline">
                                <ScanLine size={16} />
                                <span className="sr-only">Edit</span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <BarcodeScanner className="min-h-72 mb-10" onScan={(scan) => scan && handlingQRRead(scan)} />
                            {scanFetcher.state == "loading" ? "Loading" : ""}
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <Button size="icon" variant="outline">
                        <Trash size={16} />
                        <span className="sr-only">Delete</span>
                    </Button>
                </div>
            </div>
            <Tabs className="space-y-4" defaultValue={routeName == "_index" ? "details" : routeName}>
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="details" asChild><NavLink to={`/dashboard/event/${eventRes?.uuid}`}>Details</NavLink></TabsTrigger>
                    <TabsTrigger value="jenistiket" asChild><NavLink to={`/dashboard/event/${eventRes?.uuid}/jenistiket`}>Jenis Tiket</NavLink></TabsTrigger>
                    <TabsTrigger value="tiket" asChild><NavLink to={`/dashboard/event/${eventRes?.uuid}/tiket`}>Tiket</NavLink></TabsTrigger>
                    <TabsTrigger value="paymenttransaction" asChild><NavLink to={`/dashboard/event/${eventRes?.uuid}/paymenttransaction`}>Payment Transaction</NavLink></TabsTrigger>
                    <TabsTrigger value="deskripsi" asChild><NavLink to={`/dashboard/event/${eventRes?.uuid}/deskripsi`}>Deskripsi</NavLink></TabsTrigger>
                </TabsList>
                {navigation.state == "loading" ? <h1>Loading</h1> : <Outlet context={dataContext} />}
            </Tabs>
        </main>
    )
}