
import { json, TypedResponse, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { NavBar } from "~/components/common/Navbar";
import { PopularEvent } from "~/components/home/PopularEvent";
import { UserClaim } from "~/data/entity/auth/UserClaim";
import { Event } from "~/data/entity/events/Event";
import { IEventService } from "~/service/events/IEventService.server";
import { typedjson, useTypedLoaderData } from "remix-typedjson"
import { getUserClaim } from "~/utils/authUtil";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { ImageGallery } from "~/components/home/ImageGallery";

export const meta: MetaFunction = () => {
  return [
    { title: "Ngipen" },
    { name: "description", content: "Welcome to Ngipen!" },
  ];
};

export interface IndexPageLoaderType {
  events: TypedResponse<Event[]>,
  user: TypedResponse<UserClaim | undefined>
}

export async function loader({ request }: LoaderFunctionArgs) {
  const eventService = new IEventService();
  const res = await eventService.getEvents();
  const user = await getUserClaim(request)
  console.log(user)
  const events: Event[] = res.data as Event[]
  return json({ events, user })
}

export default function Index() {
  const { user } = useLoaderData<typeof loader>()
  return (
    <div className="px-24 space-y-3">
      <NavBar user={user} />
      <ImageGallery />
      <PopularEvent />
    </div>
  );
}
