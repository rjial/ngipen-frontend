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
    return (<div className="space-y-3">
        <span className="font-semibold text-xl">Popular Events</span>
        <div className="grid grid-cols-4 gap-4">
            <Suspense fallback={<LoaderCircle className={cn('my-28 h-16 w-16 text-primary/60 animate-spin')} />}>
                <Await resolve={events}>
                    {(events) => events?.map((eventItem: Event, index: number) => (
                        <EventCard key={eventItem.uuid} title={eventItem.name} desc={eventItem.desc} location={eventItem.lokasi} price={eventItem.persen.toString()} uuid={eventItem.uuid} />
                    ))}
                </Await>
            </Suspense>
        </div>
    </div>)
};