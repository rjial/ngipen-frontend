import { cn } from "@/lib/utils";
import { useLoaderData, Await } from "@remix-run/react";
import { LoaderCircle } from "lucide-react";
import { Suspense } from "react";
import { loader } from "~/routes/_index";
import { EventCard } from "../common/EventCard";

export const PopularEvent: React.FC = () => {
    const res = useLoaderData<typeof loader>()
    return (<div className="space-y-3">
        <span className="font-semibold text-xl">Popular Events</span>
        <div className="grid grid-cols-4 gap-4">
            <Suspense fallback={<LoaderCircle className={cn('my-28 h-16 w-16 text-primary/60 animate-spin')} />}>
                <Await resolve={res}>
                    {(res) => res.data?.map(eventItem => (
                        <EventCard title={eventItem.name} desc={eventItem.desc} location={eventItem.lokasi} price={eventItem.persen.toString()} />
                    ))}
                </Await>
            </Suspense>
        </div>
    </div>)
};