import { AlertDialog, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Link, NavLink, Outlet, useActionData, useFetcher, useLoaderData, useLocation, useOutletContext } from "@remix-run/react";
import { ArrowLeft, CalendarDaysIcon, Pencil, PencilIcon, Plus, ScanLine, SearchIcon, Trash, UserPlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
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

// export const loader = async ({ request, params }: LoaderFunctionArgs) => {
//     const eventService = new IEventService()
//     try {
//         const eventUuid = params.uuid || ""
//         const jenisTiketRes = await eventService.getJenisTiket(eventUuid)
//         if (jenisTiketRes.status_code == 200) {
//             return json({ error: false, message: jenisTiketRes.message, data: {jenistiket: jenisTiketRes.data} })
//         } else if(jenisTiketRes.status_code == 401) {
//             const session = await getAuthSession(request)
//             return redirect("/login", {
//                 headers: {
//                     "Set-Cookie": await destroySession(session)
//                 }
//             })
//         } else {
//             return json({ error: true, message: jenisTiketRes.message, data: undefined })
//         }
//     } catch(err) {
//         // @ts-ignore
//         return json({ error: true, message: err.message, data: undefined })
//     }
// }

export default function DashboardEventDetailPage() {
    // const data = useLoaderData<typeof loader>()
    const {eventRes} = useOutletContext<{eventRes: Event | undefined}>()
    return (
        <TabsContent value="jenistiket">
            <Outlet context={{eventRes}} />
        </TabsContent>
    )
}