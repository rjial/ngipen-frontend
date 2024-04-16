import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Await, Link, useLoaderData } from "@remix-run/react";
import { LoaderCircle, LoaderCircleIcon, Search, SearchIcon } from "lucide-react";
import { Suspense } from "react";
import { IEventService } from "~/service/events/IEventService";

export const meta: MetaFunction = () => {
  return [
    { title: "Ngipen" },
    { name: "description", content: "Welcome to Ngipen!" },
  ];
};

export async function loader({ }: LoaderFunctionArgs) {
  const eventService = new IEventService();
  const res = await eventService.getEvents();
  return json(res)
}

const NavBar: React.FC = () => (<nav className="flex flex-row w-full justify-between py-4">
  <div className="flex flex-row items-center space-x-4">
    <p className="font-semibold px-6">Ngipen</p>
    <Input type="text" placeholder="Search Ticket...." className="w-96" startIcon={Search} />
  </div>
  <div className="flex flex-row items-center space-x-4">
    <Link to="/">Home</Link>
    <Link to="/">Events</Link>
    <Link to="/">FAQ</Link>
    <Button >Daftar</Button>
  </div>
</nav>);

type EventCardProps = {
  title: string,
  desc: string,
  location: string,
  price: string
}

const EventCard: React.FC<EventCardProps> = ({ title, desc, location, price }: EventCardProps) => (<Card className="w-72">
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

const PopularEvent: React.FC = () => {
  const res = useLoaderData<typeof loader>()
  return (<div className="space-y-3">
    <span className="font-semibold text-xl">Popular Events</span>
    <div className="grid grid-cols-4 gap-4">
      <Suspense fallback={<LoaderCircle className={cn('my-28 h-16 w-16 text-primary/60 animate-spin')} />}>
        <Await resolve={res}>
          {/* {data?.map(eventItem => (
          <EventCard title={eventItem.name} desc={eventItem.desc} location={eventItem.lokasi} price={eventItem.persen.toString()} />
        ))} */}
          {(res) => res.data?.map(eventItem => (
            <EventCard title={eventItem.name} desc={eventItem.desc} location={eventItem.lokasi} price={eventItem.persen.toString()} />
          ))}
        </Await>
      </Suspense>
    </div>
  </div>)
};

export default function Index() {

  return (
    <div className="px-24">
      <NavBar />
      <PopularEvent />
    </div>
  );
}
