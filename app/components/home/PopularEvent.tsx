import { cn } from "@/lib/utils";
import { useLoaderData, Await, Link } from "@remix-run/react";
import { LoaderCircle } from "lucide-react";
import { Suspense } from "react";
import { loader } from "~/routes/_index";
import { EventCard } from "../common/EventCard";
import { Event } from "~/data/entity/events/Event";
import { TypedResponse } from "@remix-run/node";

export type PopularEventProp = {
    events: Event[] | any
}

export const PopularEvent: React.FC<PopularEventProp> = ({events}: PopularEventProp) => {
    console.log(events)
    return (<div className="space-y-3"> 
        <span className="font-semibold text-xl">All Events</span>
        <div className="grid grid-cols-4 gap-4">
            <Suspense fallback={<LoaderCircle className={cn('my-28 h-16 w-16 text-primary/60 animate-spin')} />}>
                <Await resolve={events}>
                    {(events) => events?.map((eventItem: Event, index: number) => (
                        <EventCard key={eventItem.uuid} title={eventItem.name} desc={eventItem.desc} location={eventItem.lokasi} uuid={eventItem.uuid} date={eventItem.tanggal_awal} waktuAwal={eventItem.waktu_awal} waktuAkhir={eventItem.waktu_akhir} headerimageurl={eventItem.headerimageurl} itemimageurl={eventItem.itemimageurl} startFrom={eventItem.jenisTikets.length > 0 ? eventItem.jenisTikets[0].harga : 0} />
                    ))}
                </Await>
            </Suspense>
        </div>
    </div>)
};