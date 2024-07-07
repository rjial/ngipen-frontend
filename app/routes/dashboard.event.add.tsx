import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Link, NavLink, useActionData, useFetcher, useLoaderData, useLocation } from "@remix-run/react";
import { ArrowLeft, Bold, CalendarIcon, Clock, Plus, SearchIcon } from "lucide-react";
import React, { RefObject, Suspense, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { string } from "zod";
import { UserItem } from "~/data/entity/auth/User";
import { Page } from "~/data/entity/common/Page";
import { Event } from "~/data/entity/events/Event";
import { IEventService } from "~/service/events/IEventService.server";
import { IUserService } from "~/service/user/IUserService";
import { destroySession } from "~/sessions";
import { getAuthSession } from "~/utils/authUtil";
import { handleDate } from "~/utils/dateUtil";
import { Calendar } from "@/components/ui/calendar";
import dayjs from "dayjs";
import { TimePickerInput } from "~/components/common/TimePickerInput";
import { AddEventRequest, AddEventRequestValidation } from "~/data/dto/event/AddEventRequest";
import { EditorLexical } from "~/components/common/lexical/EditorLexical";
import { EditorState } from "lexical";
// import 'quill/dist/quill.snow.css';

// export const loader = async ({ request }: LoaderFunctionArgs) => {
//     const eventService = new IEventService()
//     try {
//         const url = new URL(request.url)
//         const page = Number(url.searchParams.get("page")) || 0
//         const size = 10
//         const res = await eventService.getMyEvents(page, size, request)
//         if (res.status_code == 200) {
//             return json({ error: false, message: res.message, data: res.data })
//         } else if(res.status_code == 401) {
//             const session = await getAuthSession(request)
//             return redirect("/login", {
//                 headers: {
//                     "Set-Cookie": await destroySession(session)
//                 }
//             })
//         } else {
//             return json({ error: true, message: res.message, data: undefined })
//         }
//     } catch(err) {
//         // @ts-ignore
//         return json({ error: true, message: err.message, data: undefined })
//     }
// }

export const action = async ({request}: ActionFunctionArgs) => {
    try {
        const data = await Object.fromEntries(await request.formData())
        console.log(data)
        // const payload: AddEventRequest = {
        //     name: data.name.toString(),
        //     tanggalAwal: data.tanggal_awal.toString(),
        //     waktuAwal: data.waktu_awal.toString(),
        //     waktuAkhir: data.waktu_akhir.toString(),
        //     lokasi: data.lokasi.toString(),
        //     desc: data.desc.toString(),
        //     tanggalAkhir: data.tanggal_akhir.toString(),
        //     headerImageUrl: data.headerImageUrl != null ? data.headerImageUrl as File : undefined,
        //     itemImageUrl: data.itemImageUrl != null ? data.itemImageUrl as File : undefined
        // }
        const payloadFormData = new FormData()
        payloadFormData.append('name', data.name.toString())
        payloadFormData.append('tanggalAwal', data.tanggal_awal.toString())
        payloadFormData.append('waktuAwal', data.waktu_awal.toString())
        payloadFormData.append('waktuAkhir', data.waktu_akhir.toString())
        payloadFormData.append('lokasi', data.lokasi.toString())
        payloadFormData.append('desc', data.desc.toString())
                payloadFormData.append('tanggalAkhir', data.tanggal_akhir != undefined ? data.tanggal_akhir.toString() : "")       
        payloadFormData.append('headerImageUrl', data.headerImageUrl)
        payloadFormData.append('itemImageUrl', data.itemImageUrl)
        // const validation = AddEventRequestValidation.safeParse(payload)
        // if (!validation.success){
        //     console.log(validation.error.format())
        //     return {error: true, message: validation.error.message, data: validation.error.format()}  
        // } 
        const eventService = new IEventService()
        const res = await eventService.insertEvent(payloadFormData, request)
        if (res.status_code == 200) {
            return redirect("/dashboard/event")
        } else {
            return {error: true, message: res.message, data: undefined}
        }

    } catch(err) {
        console.log(err)
        if (err instanceof Error) {
            return {error: true, message: err.message, data: undefined}
        } else {
            // @ts-ignore
            return {error: true, message: err.message, data: undefined}
        }
    }
}

export default function DashboardEventAddPage() {
    const dataAction = useActionData<typeof action>()
    const [dateAwal, setDateAwal] = useState<Date>(new Date())
    const [dateAkhir, setDateAkhir] = useState<Date>(new Date())
    const [timeAwal, setTimeAwal] = useState<Date>(new Date())
    const [timeAkhir, setTimeAkhir] = useState<Date>(new Date())
    const timeAwalFormatted = useMemo(() => dayjs(timeAwal).format("HH:mm"), [timeAwal])
    const timeAkhirFormatted = useMemo(() => dayjs(timeAkhir).format("HH:mm"), [timeAkhir])
    const { toast } = useToast()
    const dateAwalFormatted = useMemo(() => dayjs(dateAwal).format("YYYY-MM-DD"), [dateAwal])
    const dateAkhirFormatted = useMemo(() => dayjs(dateAkhir).format("YYYY-MM-DD"), [dateAkhir])
    const minuteAwalRef = useRef<HTMLInputElement>(null);
    const hourAwalRef = useRef<HTMLInputElement>(null);
    const minuteAkhirRef = useRef<HTMLInputElement>(null);
    const hourAkhirRef = useRef<HTMLInputElement>(null);
    const [descState, setDescState] = useState<string>("")
    const headerImgRef = useRef<HTMLImageElement>(null)
    const itemImgRef = useRef<HTMLImageElement>(null)
    const [headerImgSrc, setHeaderImgSrc] = useState("")
    const [itemImgSrc, setItemImgSrc] = useState("")
    const [toggleTanggalAkhir, setToggleTanggalAkhir] = useState(false)
    const handleEditorState = useCallback((editorState: EditorState) => {
        // console.log(editorState.toJSON())
        setDescState(JSON.stringify(editorState.toJSON()))
    }, [setDescState])
    const handleDisableEnter = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === "Enter") e.preventDefault()
    }
    useEffect(() => {
        if (dataAction != undefined) {
            toast({title: dataAction.message, variant: dataAction.error ? "destructive" : "default"})
        }
    }, [dataAction])

    const handleImagePreview = ({e, ref}: {e: React.ChangeEvent<HTMLInputElement>, ref: RefObject<HTMLImageElement> | undefined}) => {
        if (ref?.current != null) {
            console.log(e.target.files)
            if (e.target.files?.length! > 0) {
                let imgObject = e.target.files?.item(0);
                if (imgObject != null || imgObject != undefined) {
                    const objectUrl = URL.createObjectURL(imgObject)
                    ref.current.src = objectUrl
                }
            }
            // ref.src = e.target.files[0]
        }
    }

    return (
        <div className="flex flex-col w-full gap-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex justify-center space-x-3">
                    <Button asChild size="icon" variant="outline">
                        <Link to={`/dashboard/event`}>
                            <ArrowLeft size={16} />
                            <span className="sr-only">Back</span>
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Event Management</h1>
                </div>
            </div>
            <div className="border rounded-lg shadow-sm">
                <Form className="p-4 grid gap-4" method="POST" onSubmit={handleDisableEnter} encType="multipart/form-data">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Event Name</Label>
                        <Input id="name" name="name" placeholder="Enter name" />
                        {/* {dataAction && dataAction.error && dataAction.data.name && <span className="text-[0.8rem] text-red-400">{dataAction.data.name._errors[0]}</span>} */}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="lokasi">Location</Label>
                        <Input id="lokasi" name="lokasi" placeholder="Enter location" type="text" />
                        {/* {dataAction && dataAction.error && dataAction.data.lokasi && <span className="text-[0.8rem] text-red-400">{dataAction.data.lokasi._errors[0]}</span>} */}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="persen">Tanggal Awal Event</Label>
                        <input type="hidden" name="tanggal_awal" value={dateAwalFormatted} />
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "justify-start text-left font-normal",
                                        !dateAwal && "text-muted-foreground"
                                    )}
                                >
                                    {dateAwal ? handleDate(dateAwal) : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={dateAwal}
                                    onSelect={(dateSelect) => setDateAwal(dateSelect!)}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        {/* {dataAction && dataAction.error && dataAction.data.tanggal_awal && <span className="text-[0.8rem] text-red-400">{dataAction.data.tanggal_awal._errors[0]}</span>} */}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="persen">Tanggal Akhir Event</Label>
                        <div className="flex space-x-4">
                            <input type="hidden" name="tanggal_akhir" disabled={!toggleTanggalAkhir} value={dateAkhirFormatted} />
                            <input type="checkbox" onChange={(e) => setToggleTanggalAkhir(e.target.checked)} value={toggleTanggalAkhir ? 1 : 0} name="toggle_tanggal_akhir" />
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        disabled={!toggleTanggalAkhir}
                                        variant={"outline"}
                                        className={cn(
                                            "justify-start text-left font-normal w-full",
                                            !dateAkhir && "text-muted-foreground"
                                        )}
                                    >
                                        {dateAkhir ? handleDate(dateAkhir) : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={dateAkhir}
                                        onSelect={(dateSelect) => setDateAkhir(dateSelect!)}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        {/* {dataAction && dataAction.error && dataAction.data.tanggal_akhir && <span className="text-[0.8rem] text-red-400">{dataAction.data.tanggal_akhir._errors[0]}</span>} */}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="waktu_awal">Waktu Awal</Label>
                        <input type="hidden" name="waktu_awal" value={timeAwalFormatted}  />
                        <div className="flex items-end gap-2">
                            <div className="grid gap-1 text-center">
                                <TimePickerInput
                                    picker="hours"
                                    date={timeAwal}
                                    setDate={(dateSelect) => setTimeAwal(dateSelect!)}
                                    ref={hourAwalRef}
                                    onRightFocus={() => minuteAwalRef.current?.focus()}
                                />
                            </div>
                            <div className="grid gap-1 text-center">
                                <TimePickerInput
                                    picker="minutes"
                                    date={timeAwal}
                                    setDate={(dateSelect) => setTimeAwal(dateSelect!)}
                                    ref={minuteAwalRef}
                                    onLeftFocus={() => hourAwalRef.current?.focus()}
                                />
                            </div>
                        </div>
                        {/* {dataAction && dataAction.error && dataAction.data.waktu_awal && <span className="text-[0.8rem] text-red-400">{dataAction.data.waktu_awal._errors[0]}</span>} */}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="waktu_akhir">Waktu Akhir</Label>
                        <input type="hidden" name="waktu_akhir" value={timeAkhirFormatted}  />
                        <div className="flex items-end gap-2">
                            <div className="grid gap-1 text-center">
                                <TimePickerInput
                                    picker="hours"
                                    date={timeAkhir}
                                    setDate={(dateSelect) => setTimeAkhir(dateSelect!)}
                                    ref={hourAkhirRef}
                                    onRightFocus={() => minuteAkhirRef.current?.focus()}
                                />
                            </div>
                            <div className="grid gap-1 text-center">
                                <TimePickerInput
                                    picker="minutes"
                                    date={timeAkhir}
                                    setDate={(dateSelect) => setTimeAkhir(dateSelect!)}
                                    ref={minuteAkhirRef}
                                    onLeftFocus={() => hourAkhirRef.current?.focus()}
                                />
                            </div>
                        </div>
                        {/* {dataAction && dataAction.error && dataAction.data.waktu_akhir && <span className="text-[0.8rem] text-red-400">{dataAction.data.waktu_akhir._errors[0]}</span>} */}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="headerImageUrl">Header Image</Label>
                        <img className="w-full h-96 object-cover rounded-lg" id="headerImg" ref={headerImgRef} />
                        <Input id="headerImageUrl" name="headerImageUrl" placeholder="Upload a header image" type="file" onChange={(e) => handleImagePreview({e, ref: headerImgRef})} />
                        {/* {dataAction && dataAction.error && dataAction.data.headerImageUrl && <span className="text-[0.8rem] text-red-400">{dataAction.data.headerImageUrl._errors[0]}</span>} */}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="itemIma geUrl">Thumbnail Image</Label>
                        <img className="w-64 h-64 object-cover rounded-lg" id="itemImg" ref={itemImgRef} />
                        <Input id="itemImageUrl" name="itemImageUrl" placeholder="Upload a thumbnail image" type="file" onChange={(e) => handleImagePreview({e, ref: itemImgRef})}/>
                        {/* {dataAction && dataAction.error && dataAction.data.itemImageUrl && <span className="text-[0.8rem] text-red-400">{dataAction.data.itemImageUrl._errors[0]}</span>} */}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="desc">Description</Label>
                        <input type="hidden" name="desc" value={descState} />
                        <Suspense fallback={<span>Loading Editor</span>}>
                            <EditorLexical handleChange={handleEditorState} />
                        </Suspense>
                        {/* {dataAction && dataAction.error && dataAction.data.desc && <span className="text-[0.8rem] text-red-400">{dataAction.data.desc._errors[0]}</span>} */}
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button type="submit">Save</Button>
                    </div>
                </Form>
            </div>
        </div>
    )
}
