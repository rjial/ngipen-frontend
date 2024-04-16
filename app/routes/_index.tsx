
import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { NavBar } from "~/components/common/Navbar";
import { PopularEvent } from "~/components/home/PopularEvent";
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
export default function Index() {

  return (
    <div className="px-24">
      <NavBar />
      <PopularEvent />
    </div>
  );
}
