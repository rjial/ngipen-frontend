import { AlertDialog, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Link, NavLink, useActionData, useFetcher, useLoaderData, useLocation, useOutletContext } from "@remix-run/react";
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

export default function DashboardEventDetailPage() {
    const {eventRes} = useOutletContext<{eventRes: Event | undefined}>()
    return (
        <TabsContent value="details">
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold">Detail</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild size="icon" variant="outline">
                            <Link to={`/dashboard/event/${eventRes?.uuid}/jenistiket/add`}>
                                <Pencil size={16} />
                                <span className="sr-only">Edit</span>
                            </Link>
                        </Button>
                    </div>
                </div>
                <div className="border rounded-lg shadow-sm">
                    <div className="flex items-center gap-4 p-4 border-b">
                        <img
                            alt="Avatar"
                            className="rounded-full"
                            height="48"
                            src="https://source.unsplash.com/U7HLzMO4SIY"
                            style={{
                                aspectRatio: "48/48",
                                objectFit: "cover",
                            }}
                            width="48"
                        />
                        <div>
                            <div className="font-medium">{eventRes?.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{eventRes?.lokasi}</div>
                        </div>
                    </div>
                    <div className="p-4 grid md:grid-cols-3 gap-4">
                        <div className="grid gap-1">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Lokasi</div>
                            <div className="font-medium">{eventRes?.lokasi}</div>
                        </div>
                        <div className="grid gap-1">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Tanggal Event</div>
                            <div className="font-medium">{handleDate(eventRes?.tanggal_awal || "")}</div>
                        </div>
                        <div className="grid gap-1">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Waktu Event</div>
                            <div className="font-medium">
                                {eventRes?.waktu_awal} - {eventRes?.waktu_akhir}
                            </div>
                        </div>
                        <div className="grid gap-1">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Last Login</div>
                            <div className="font-medium">2023-04-25 10:30 AM</div>
                        </div>
                        <div className="grid gap-1">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Created At</div>
                            <div className="font-medium">2022-06-15 03:45 PM</div>
                        </div>
                    </div>
                </div>
            </div>
        </TabsContent>
    )
}