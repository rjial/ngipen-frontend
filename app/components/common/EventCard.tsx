import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "@remix-run/react";
import { Calendar, Clock, MapPinned } from "lucide-react";
import { handleDate } from "~/utils/dateUtil";
import { getRandomPhoto } from "~/utils/photosUtil";

export type EventCardProps = {
    title: string,
    desc: string,
    location: string,
    price: string,
    uuid: string,
    date: string,
    waktuAwal: string,
    waktuAkhir: string
}

export const EventCard: React.FC<EventCardProps> = ({ title, desc, location, price, uuid, date, waktuAwal, waktuAkhir }: EventCardProps) => (<Card className="w-72"><Link to={`/event/${uuid}`}>
    <img src={getRandomPhoto()} alt="Card Image" className="w-full h-64 object-cover rounded-t-lg" />
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
        <Button className="w-full">Buy Ticket</Button>
    </CardFooter>
</Link>
</Card>);