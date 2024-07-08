import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "@remix-run/react";
import { Calendar, Clock, MapPinned } from "lucide-react";
import { handleDate } from "~/utils/dateUtil";
import { handleCurrency } from "~/utils/numberUtil";
import { getRandomPhoto } from "~/utils/photosUtil";

export type EventCardProps = {
    title: string,
    desc: string,
    location: string,
    uuid: string,
    date: string,
    waktuAwal: string,
    waktuAkhir: string,
    headerimageurl: string,
    itemimageurl: string,
    startFrom: number,
}

export const EventCard: React.FC<EventCardProps> = ({ title, desc, location, uuid, date, waktuAwal, waktuAkhir, headerimageurl, itemimageurl, startFrom }: EventCardProps) => (<Card className="w-72"><Link to={`/event/${uuid}`}>
    <img src={itemimageurl != undefined ? itemimageurl : "https://images.placeholders.dev/?width=320&height=320&text=" + title + "&bgColor=%23f7f6f6&textColor=%236d6e71"} alt="Card Image" className="w-full h-64 object-cover rounded-t-lg" />
    <CardHeader>
        <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="max-h-32 space-y-4">
        <div className="flex gap-4 items-center">
            <Calendar />
            <span>{handleDate(date)}</span>
        </div>
        <div className="flex gap-4 items-center">
            <Clock />
            <span>{waktuAwal} - {waktuAkhir}</span>
        </div>
        <div className="flex gap-4 items-center">
            <MapPinned />
            <span>{location}</span>
        </div>
        {/* <p className="text-ellipsis overflow-hidden h-32">{desc}</p> */}
    </CardContent>
    <CardFooter className="flex flex-row justify-between">
        <Button className="w-full">{startFrom > 0 ? "Start From " + handleCurrency(startFrom) : "Buy Now"}</Button>
    </CardFooter>
</Link>
</Card>);