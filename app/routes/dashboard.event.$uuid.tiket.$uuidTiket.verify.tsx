import { AlertDialog, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Link, NavLink, useActionData, useFetcher, useLoaderData, useLocation, useOutletContext } from "@remix-run/react";
import { ArrowLeft, CalendarDaysIcon, Check, Ellipsis, Pencil, PencilIcon, Plus, ScanLine, SearchIcon, Trash, UserPlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { UserItem } from "~/data/entity/auth/User";
import { Page } from "~/data/entity/common/Page";
import { Event } from "~/data/entity/events/Event";
import { JenisTiket } from "~/data/entity/events/JenisTiket";
import { IEventService } from "~/service/events/IEventService.server";
import { IUserService } from "~/service/user/IUserService";
import { commitSession, destroySession } from "~/sessions";
import { getAuthSession } from "~/utils/authUtil";
import { handleDate } from "~/utils/dateUtil";
import { levelName } from "~/utils/levelUtil";
import { BarcodeScanner } from '@alzera/react-scanner';
import { ITicketService } from "~/service/ticket/ITicketService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tiket } from "~/data/entity/ticket/Tiket";
import { TiketItemListResponse } from "~/data/dto/ticket/TiketItemListResponse";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const tiketService = new ITicketService()
    const eventUuid = params.uuid || ""
    const tiketUuid = params.uuidTiket || ""
    const url = new URL(request.url)
    const status = url.searchParams.get("status") == "1"
    console.log(status)
    try {
        const tiketRes = await tiketService.verifyTiketByUUID({uuid: tiketUuid, status: status, request: request})
        if (tiketRes.status_code == 200) {
            return redirect(`/dashboard/event/${eventUuid}/tiket/${tiketUuid}`)
        } else if(tiketRes.status_code == 401) {
            const session = await getAuthSession(request)
            return redirect("/login", {
                headers: {
                    "Set-Cookie": await destroySession(session)
                }
            })
        } else {
            const session = await getAuthSession(request)
            const token = session.get("jwtToken") || ""
            session.set("jwtToken", token)
            session.flash("error", tiketRes.message)
            return redirect(`/dashboard/event/${eventUuid}/tiket/${tiketUuid}`, {headers: {"Set-Cookie": await commitSession(session)}})
        }
    } catch(err) {
        const session = await getAuthSession(request)
        const token = session.get("jwtToken") || ""
        session.set("jwtToken", token)
        // @ts-ignore
        session.flash("error", err.message)
        return redirect(`/dashboard/event/${eventUuid}/tiket/${tiketUuid}`, {headers: {"Set-Cookie": await commitSession(session)}})
    }
}
