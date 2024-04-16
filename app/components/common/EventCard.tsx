import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export type EventCardProps = {
    title: string,
    desc: string,
    location: string,
    price: string
}

export const EventCard: React.FC<EventCardProps> = ({ title, desc, location, price }: EventCardProps) => (<Card className="w-72">
    <img src="https://source.unsplash.com/JNuKyKXLh8U" alt="Card Image" className="w-full h-64 object-cover rounded-t-lg" />
    <CardHeader>
        <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
        <span>{desc}</span>
    </CardContent>
    <CardFooter className="flex flex-row justify-between">
        <span>{location}</span>
        <span>{price}</span>
    </CardFooter>
</Card>);