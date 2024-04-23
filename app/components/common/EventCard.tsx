import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "@remix-run/react";

export type EventCardProps = {
    title: string,
    desc: string,
    location: string,
    price: string,
    uuid: string
}

export const EventCard: React.FC<EventCardProps> = ({ title, desc, location, price, uuid }: EventCardProps) => (<Card className="w-72"><Link to={`/event/${uuid}`}>
    <img src="https://source.unsplash.com/JNuKyKXLh8U" alt="Card Image" className="w-full h-64 object-cover rounded-t-lg" />
    <CardHeader>
        <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="h-32">
        <p className="text-ellipsis overflow-hidden h-32">{desc}</p>
    </CardContent>
    <CardFooter className="flex flex-row justify-between">
        <span>{location}</span>
        <span>{price}</span>
    </CardFooter>
</Link>
</Card>);