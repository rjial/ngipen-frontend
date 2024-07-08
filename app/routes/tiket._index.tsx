import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { Calendar, CircleIcon, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { redirect } from "remix-typedjson";
import { NavBar } from "~/components/common/Navbar";
import { Page } from "~/data/entity/common/Page";
import { TiketItemListResponse } from "~/data/dto/ticket/TiketItemListResponse";
import { ITicketService } from "~/service/ticket/ITicketService";
import { destroySession } from "~/sessions";
import { getAuthSession } from "~/utils/authUtil";
import { handleDate } from "~/utils/dateUtil";
import { InfiniteScroller } from "~/components/common/InfiniteScroll";
import { LoaderRes, LoaderResI } from "~/data/entity/common/LoaderRes";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const ticketService = new ITicketService()
    const url = new URL(request.url)
    const page = Number(url.searchParams.get("page")) || 0
    const size = 10
    try {
        
        const res = await ticketService.getTickets({ page: page, size: size, request: request })
        if (res.status_code == 200) {
            return json({ error: false, message: res.message, data: res.data })
        } else if (res.status_code == 401) {
            const session = await getAuthSession(request)
            return redirect("/login", {
                headers: {
                    "Set-Cookie": await destroySession(session)
                }
            })
        } else {
            return json({ error: true, message: res.message, data: res.data })
        }
    } catch (err) {
        // @ts-ignore
        return json({ error: true, message: err.message, data: undefined })
    }
}

export default function TiketPage() {
    const { error, message, data } = useLoaderData<typeof loader>()
    const { toast } = useToast()
    const [initialData, setInitialData] = useState<TiketItemListResponse[]>(data?.content || [])
    const fetcher = useFetcher<LoaderResI<Page<TiketItemListResponse>>>()
    useEffect(() => {
        // console.log(data)
        // if (data != undefined) console.log(data, typeof data)
        if (error) toast({ title: message, variant: error ? "destructive" : "default" })
    }, [data])
    useEffect(() => {
        if (!fetcher.data || fetcher.state === "loading") {
            return;
        }

        if (fetcher.data) {
            const newItems = fetcher.data.data?.content
            setInitialData((prevItems) => [...prevItems, ...newItems || []])
        }
    }, [fetcher.data])
    const loadNext = () => {
        if (initialData.length >= 10) {
            const page = fetcher.data?.data?.pageable.pageNumber || 0 + 1
            const query = `?index&page=${page}`
            fetcher.load(query)
        }
    }
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
            <InfiniteScroller loadNext={loadNext} loading={fetcher.state === "loading"}>
                <div className="grid grid-cols-1 gap-6">
                    {initialData.length > 0 && initialData.map((ticketItem) => {
                        return (
                            <Card className="w-full">
                                <CardHeader>
                                    <div className="flex items-center space-x-3">
                                        <CardTitle>
                                            {ticketItem.event}
                                        </CardTitle>
                                        <Badge className={cn("bg-white dark:bg-gray-950 w-fit h-fit", ticketItem.statusTiket ? "border-green-600" : "border-red-600")} variant="outline">
                                            <CircleIcon className={cn("h-3 w-3 -translate-x-1 animate-pulse ", ticketItem.statusTiket ? "fill-green-300 text-green-300" : "fill-red-300 text-red-300")} />
                                            {ticketItem.statusTiket ? "Terverifikasi" : "Belum Terverifikasi"}
                                        </Badge>
                                    </div>
                                    
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
            </InfiniteScroller>
        </div>
    )
}