import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Calendar, MapPin } from "lucide-react";
import { useEffect } from "react";
import { redirect } from "remix-typedjson";
import { NavBar } from "~/components/common/Navbar";
import { Page } from "~/data/entity/common/Page";
import { Tiket } from "~/data/entity/ticket/Tiket";
import { ITicketService } from "~/service/ticket/ITicketService";
import { destroySession } from "~/sessions";
import { getAuthSession } from "~/utils/authUtil";
import { handleDate } from "~/utils/dateUtil";

export const loader = async ({request}: LoaderFunctionArgs) => {
    const ticketService = new ITicketService()
    try {
        const res = await ticketService.getTickets({page: 0, size: 10, request: request})
        if (res.status_code == 200) {
            return json({error: false, message: res.message, data: res.data})
        } else if(res.status_code == 401) {
            const session = await getAuthSession(request)
            return redirect("/login", {
                headers: {
                    "Set-Cookie": await destroySession(session)
                }
            })
        } else {
            return json({error: true, message: res.message, data: res.data})
        }
    } catch(err) {
        // @ts-ignore
        return json({error: true, message: err.message, data: undefined})
    }
}

export default function TiketPage() {
    const {error, message, data} = useLoaderData<typeof loader>()
    const {toast} = useToast()
    useEffect(() => {
        // console.log(data)
        if (data != undefined) console.log(data, typeof data)
        if (error) toast({title: message, variant: error ? "destructive" : "default"})
    }, [data])
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
                        <BreadcrumbLink href="/tiket">Ticket</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="grid grid-cols-1 gap-6">
                {data != undefined && (data as Page<Tiket>).content.length > 0 && (data as Page<Tiket>).content.map((ticketItem) => {
                    return (
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle>{ticketItem.event}</CardTitle>
                                <CardDescription>{handleDate(ticketItem.date)} - ({ticketItem.waktu_awal} - {ticketItem.waktu_akhir})</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Ticket Type</p>
                                        <p className="font-medium">{ticketItem.jenisTiket}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Total</p>
                                        <p className="font-medium">Rp {ticketItem.price}</p>
                                    </div>
                                </div>
                                <Separator className="my-4" />
                            </CardContent>
                            <CardFooter>
                                <Button size="sm" variant="outline" asChild>
                                    <Link to={`/tiket/${ticketItem.uuid}`}>View Details</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}