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
import { Form, Link, NavLink, useActionData, useLoaderData, useLocation } from "@remix-run/react";
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

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const eventService = new IEventService()
    try {
        const eventUuid = params.uuid || ""
        const idJenisTiket = Number(params.id)
        const eventRes = await eventService.deleteJenisTiket(idJenisTiket, eventUuid, request)
        if (eventRes.status_code == 200) {
            // const jenisTiketRes = await eventService.getJenisTiket(eventRes.data?.uuid!)
            return redirect(`/dashboard/event/${eventUuid}/jenistiket`)
            // return json({ error: false, message: eventRes.message, data: eventRes.data })
        } else if(eventRes.status_code == 401) {
            const session = await getAuthSession(request)
            return redirect("/login", {
                headers: {
                    "Set-Cookie": await destroySession(session)
                }
            })
        } else {
            return redirect(`/dashboard/event/${eventUuid}/jenistiket`)
        }
    } catch(err) {
        // @ts-ignore
        return redirect(`/dashboard/event/${eventUuid}/jenistiket`)
    }
    // return json({})
}