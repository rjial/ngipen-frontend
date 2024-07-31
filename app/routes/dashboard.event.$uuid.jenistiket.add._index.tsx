import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Link, NavLink, useActionData, useLoaderData, useLocation, useOutletContext } from "@remix-run/react";
import { ArrowLeft, CalendarDaysIcon, Pencil, PencilIcon, Plus, SearchIcon, Trash, UserPlusIcon } from "lucide-react";
import { useEffect } from "react";
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
import {useMaskito} from '@maskito/react';
import { rupiahMask } from "~/utils/maskUtil";
import { useHookFormMask, withMask } from 'use-mask-input';
import { AddJenisTiketRequest, AddJenisTiketRequestValidation } from "~/data/dto/event/AddJenisTiketRequest";

export const action = async ({request, params}: ActionFunctionArgs) => {
    const formData = await request.formData()
    const fromFormData: AddJenisTiketRequest = {name: formData.get("name")?.toString() as string, harga: Number(formData.get("harga"))}
    try {
        const eventUuid = params.uuid || ""
        const validation = AddJenisTiketRequestValidation.safeParse(fromFormData)
        const eventService = new IEventService()
        if (!validation.success) return json({error: true, message: validation.error.message, data: validation.error.format()})
        const res = await eventService.insertJenisTiket(validation.data, eventUuid, request)
        if (res.status_code == 200) {
            return redirect(`/dashboard/event/${eventUuid}/jenistiket`)
        } else if(res.status_code == 401) {
            const session = await getAuthSession(request)
            return redirect("/login", {
                headers: {
                    "Set-Cookie": await destroySession(session)
                }
            })
        } else {
            return json({error: true, message: res.message, data: undefined})
        }
    } catch(err) {
        // @ts-ignore
        return json({error: true, message: err.message, data: undefined})
    }
}



export default function DashboardEventAddJenisTiketPage() {
    const actionData = useActionData<typeof action>()
    const {eventRes} = useOutletContext<{eventRes: Event | undefined}>()
    const { toast } = useToast()
    useEffect(() => {
        if (actionData != undefined) {
            toast({ title: actionData.message, variant: actionData.error ? "destructive" : "default" })
        }
    }, [actionData])
    return (
        <main className="flex flex-col w-full gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button asChild size="icon" variant="outline">
                        <Link to={`/dashboard/event/${eventRes?.uuid}/jenistiket`}>
                            <ArrowLeft size={16} />
                            <span className="sr-only">Back</span>
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Add Jenis Tiket ({eventRes?.name})</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline">
                        <Pencil size={16} />
                        <span className="sr-only">Edit</span>
                    </Button>
                    <Button size="icon" variant="outline">
                        <Trash size={16} />
                        <span className="sr-only">Delete</span>
                    </Button>
                </div>
            </div>
            <div className="gap-4">
                <div className="border rounded-lg shadow-sm">
                    <Form className="p-4 grid gap-4" method="POST">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" placeholder="Enter name" />
                            {actionData && actionData.error && actionData.data.name && <span className="text-[0.8rem] text-red-400">{actionData.data.name._errors[0]}</span>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="harga">Harga</Label>
                            <Input id="harga" name="harga" placeholder="Enter harga" type="number" />
                            {actionData && actionData.error && actionData.data.harga && <span className="text-[0.8rem] text-red-400">{actionData.data.harga._errors[0]}</span>}
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline">Cancel</Button>
                            <Button type="submit">Save</Button>
                        </div>
                    </Form>
                </div>
            </div>
        </main>
    )
}
