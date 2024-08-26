import { AlertDialog, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect, redirectDocument } from "@remix-run/node";
import { Link, NavLink, Outlet, useActionData, useFetcher, useLoaderData, useLocation, useMatches, useNavigation, useOutletContext } from "@remix-run/react";
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
import { UserClaim } from "~/data/entity/auth/UserClaim";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TiketItemListResponse } from "~/data/dto/ticket/TiketItemListResponse";
import DashboardDetailTiketCard from "~/components/dashboard/tiket/DashboardDetailTiketCard";
import { Tiket } from "~/data/entity/ticket/Tiket";
import { barcodeDecoderOptions, qrDecoderOptions } from "~/utils/barcodeUtil";

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

export const action = async ({request, params}: ActionFunctionArgs) => {
    const jsonPayload: {key: string, data: any} = await request.json()
    const eventUuid = params.uuid || ""
    try {
        const ticketService = new ITicketService()
        switch(jsonPayload.key) {
            case "verify-qr":
                const res = await ticketService.verifyTiketQR({payload: jsonPayload.data.payload}, request)
                console.log(res)
                if (res.status_code == 200) {
                    console.log(jsonPayload)
                    return {error: false, message: res.message, data: {key: "verify-qr", data: {tiket: res.data}}}
                } else {
                    return {error: true, message: res.message, data: undefined}
                }
                break
            case "scan-qr":
                const resScanQr = await ticketService.scanTiketQR({payload: jsonPayload.data.payload}, request)
                console.log(resScanQr)
                if (resScanQr.status_code == 200) {
                    console.log(jsonPayload)
                    return {error: false, message: resScanQr.message, data: {key: "scan-qr", data: {tiket: resScanQr.data}}}
                } else {
                    return {error: true, message: resScanQr.message, data: undefined}
                }
                break
            case "scan-barcode":
                const jsonBarcode: {payload: string} = jsonPayload.data
                const resBarcode = await ticketService.getTiket({uuid: jsonBarcode.payload, request: request})
                // const resBarcode = await ticketService.verifyTiketByUUID({uuid: jsonBarcode.payload, status: true, request: request})
                switch(resBarcode.status_code) {
                    case 200:
                        return {error: false, message: resBarcode.message, data: {key: "scan-barcode", data: {tiket: resBarcode.data}}}
                        break
                    default:
                        return {error: true, message: resBarcode.message, data: undefined}
                        break
                }
                break
            case "verify-barcode":
                const jsonVerifyBarcode: {payload: string} = jsonPayload.data
                const resVerifyBarcode = await ticketService.verifyTiketByUUID({uuid: jsonVerifyBarcode.payload, status: true, request})
                switch(resVerifyBarcode.status_code) {
                    case 200:
                        return {error: false, message: resVerifyBarcode.message, data: {key: "verify-barcode", data: {tiket: resVerifyBarcode.data}}}
                        break
                    default:
                        return {error: true, message: resVerifyBarcode.message, data: undefined}
                        break
                }
                break
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
    const data = useLoaderData<
        {error: true, message: string | undefined, data: undefined} |
        {error: false, message: string | undefined, data: {event: Event}}>()
    const actionData = useActionData<
        {error: true, message: string | undefined, data: undefined} |
        {error: false, message: string | undefined, data: {key: "scan-barcode", data: {tiket: TiketItemListResponse}}} |
        {error: false, message: string | undefined, data: {key: "verify-barcode", data: {tiket: TiketItemListResponse}}} |
        {error: false, message: string | undefined, data: {key: "verify-qr", data: {tiket: TiketItemListResponse}}} |
        {error: false, message: string | undefined, data: {key: "scan-qr", data: {tiket: TiketItemListResponse}}}
        >()
    const {user} = useOutletContext<{user: UserClaim | undefined}>()
    const matches = useMatches()
    const routeName = matches.at(-1)?.id.split(".").slice(3)[0]
    useEffect(() => {
        if (matches != undefined) console.log(matches.at(-1)?.id.split(".").slice(3))
    }, [matches])
    // const { search } = useLocation()
    // const page = new URLSearchParams(search).get("page")
    // const eventRes: Event | undefined = data.data.event || undefined
    // const jenisTiketRes: JenisTiket[] | undefined = data.data.jenisTiket || undefined
    const [isRedirectToTiket, setIsRedirectToTiket] = useState(false)
    const [isBarcodeWithCamera, setIsBarcodeWithCamera] = useState(false)
    const [isBarcodeAutoVerify, setIsBarcodeAutoVerify] = useState(true)
    const [barcodeValue, setBarcodeValue] = useState("")
    const [isQRAutoVerify, setIsQRAutoVerify] = useState(true)
    const { toast } = useToast()
    const [qrRead, setQRRead] = useState("Not Found")
    const [modal, setModal] = useState<boolean>(false)
    const scanFetcher = useFetcher<typeof action>()
    const [tiketScanned, setTiketScanned] = useState<TiketItemListResponse | undefined>(undefined)
    // const dataContext = {eventRes, user}
    const navigation = useNavigation()
    // if (data != undefined) {
    //     toast({ title: data.message, variant: data.error ? "destructive" : "default" })
    // }
    const handlingOpenQR = (open: boolean) => {
        setQRRead("")
        setBarcodeValue("")
        setTiketScanned(undefined)
        setModal(open)
    }
    const handlingQRVerify = (dataQR: string) => {
        setQRRead(dataQR)
        const dataPayload = {
            payload: dataQR,
        }
        // handlingOpenQR(false)
        scanFetcher.submit({key: "verify-qr", data: dataPayload}, {method: "POST", encType: "application/json"})
        //process
    }
    const handlingQRScan = (dataQR: string) => {
        setQRRead(dataQR)
        const dataPayload = {
            payload: dataQR,
        }
        // handlingOpenQR(false)
        scanFetcher.submit({key: "scan-qr", data: dataPayload}, {method: "POST", encType: "application/json"})
        //process
    }
    const handlingBarcodeRead = (dataBarcode: string) => {
        // setBarcodeValue(dataBarcode)
        const dataPayload = {
            payload: dataBarcode,
        }
        scanFetcher.submit({key: "scan-barcode", data: dataPayload}, {method: "POST", encType: "application/json"})
    }
    const handlingBarcodeVerify = (dataBarcode: string) => {
        // setBarcodeValue(dataBarcode)
        const dataPayload = {
            payload: dataBarcode
        }
        scanFetcher.submit({key: "verify-barcode", data: dataPayload}, {method: "POST", encType: "application/json"})
    }
    // useEffect(() => {
    //     if (data != undefined) {
    //         toast({ title: data.message, variant: data.error ? "destructive" : "default" })
    //     }
    // }, [data])
    useEffect(() => {
        const res = scanFetcher.data as typeof actionData
        console.log(res?.message)
        if (res != undefined) {
            if (res.error) {
                toast({ title: res.message, variant: "destructive"})
            } else {
                setBarcodeValue("")
                if (res.data.key == "scan-barcode") {
                    setTiketScanned(res.data.data.tiket)
                    if (isBarcodeAutoVerify) {
                        handlingBarcodeVerify(res.data.data.tiket.uuid)
                    }
                } else if (res.data.key == "verify-barcode") {
                    toast({ title: res.message, variant: "default"})
                    setTiketScanned(res.data.data.tiket)
                } else if (res.data.key == "scan-qr") {
                    setTiketScanned(res.data.data.tiket)
                    if (isQRAutoVerify) {
                        handlingQRScan(qrRead)
                    }
                } else if (res.data.key == "verify-qr") {
                    toast({ title: res.message, variant: "default"})
                    setTiketScanned(res.data.data.tiket)
                }
            }
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
                        <AlertDialogContent className="max-w-7xl">
                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-8">
                                    {tiketScanned && <DashboardDetailTiketCard tiket={tiketScanned} />}
                                </div>
                                <Tabs className="space-y-4 col-span-4" defaultValue="barcode">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="barcode">Barcode</TabsTrigger>
                                        <TabsTrigger value="qr">QR Code</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="barcode">
                                        <div className="grid gap-2">
                                            <div className="w-64 flex items-center">
                                                {isBarcodeWithCamera ? <BarcodeScanner decoderOptions={{formats: ["code_128"]}} className="" onScan={(value) => {setBarcodeValue(value); handlingBarcodeRead(value)}} /> : <></>}
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Switch id="with-camera" checked={isBarcodeWithCamera} onCheckedChange={(checked) => setIsBarcodeWithCamera(checked)} />
                                                <Label htmlFor="with-camera">With Camera</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Switch id="auto-verify" checked={isBarcodeAutoVerify} onCheckedChange={(checked) => setIsBarcodeAutoVerify(checked)} />
                                                <Label htmlFor="auto-verify">Auto Verify</Label>
                                            </div>
                                            <scanFetcher.Form className="space-y-3" onSubmit={(e) => {
                                                e.preventDefault()
                                                handlingBarcodeRead(barcodeValue)
                                            }}>
                                                <Input id="value" name="value" value={barcodeValue} onChange={((e) => setBarcodeValue(e.target.value))} placeholder="XXXXXX-XXXXXX" />
                                                <Button className="w-full">Verify</Button>
                                            </scanFetcher.Form>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="qr">
                                        <div className="w-64 flex items-center">
                                            <BarcodeScanner decoderOptions={{formats: ["qr_code", "rm_qr_code", "micro_qr_code"]}} className="" onScan={(scan) => scan && handlingQRVerify(scan)} />
                                        </div>
                                        {scanFetcher.state == "loading" ? "Loading" : ""}
                                        <div className="flex items-center">
                                            {/* <Switch id="redirect-to-tiket" checked={isRedirectToTiket} onCheckedChange={(checked) => setIsRedirectToTiket(checked)} /> */}
                                            <Switch id="auto-verify-qr" checked={isQRAutoVerify} onCheckedChange={(checked) => setIsQRAutoVerify(checked)} />
                                            <Label htmlFor="redirect-to-tiket">Redirect To Tiket</Label>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Close</AlertDialogCancel>
                                {/* <AlertDialogAction>Continue</AlertDialogAction> */}
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <Button size="icon" variant="outline">
                        <Trash size={16} />
                        <span className="sr-only">Delete</span>
                    </Button>
                </div>
            </div>
            {data.error ? <>Error : {data.message}</> : <Tabs className="space-y-4" defaultValue="details" value={routeName == "_index" ? "details" : routeName}>
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="details" asChild><NavLink to={`/dashboard/event/${data.data.event.uuid}`}>Details</NavLink></TabsTrigger>
                    <TabsTrigger value="jenistiket" asChild><NavLink to={`/dashboard/event/${data.data.event.uuid}/jenistiket`}>Jenis Tiket</NavLink></TabsTrigger>
                    <TabsTrigger value="tiket" asChild><NavLink to={`/dashboard/event/${data.data.event.uuid}/tiket`}>Tiket</NavLink></TabsTrigger>
                    <TabsTrigger value="paymenttransaction" asChild><NavLink to={`/dashboard/event/${data.data.event.uuid}/paymenttransaction`}>Payment Transaction</NavLink></TabsTrigger>
                    <TabsTrigger value="deskripsi" asChild><NavLink to={`/dashboard/event/${data.data.event.uuid}/deskripsi`}>Deskripsi</NavLink></TabsTrigger>
                </TabsList>
                {navigation.state == "loading" ? <h1>Loading</h1> : <Outlet context={{eventRes: data.data.event, user: user}} />}
            </Tabs>}
            
        </main>
    )
}