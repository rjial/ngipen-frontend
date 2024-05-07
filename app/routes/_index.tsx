
import { json, TypedResponse, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useFetcher, useLoaderData, useOutletContext } from "@remix-run/react";
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
import { useEffect, useRef, useState } from "react";
import { Page } from "~/data/entity/common/Page";

export const meta: MetaFunction = () => {
  return [
    { title: "Ngipen" },
    { name: "description", content: "Welcome to Ngipen!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const page = Number(url.searchParams.get("page")) || 0
  const size = 12
  const eventService = new IEventService();
  const res = await eventService.getEvents(page, size, request);
  return json({ res: res.data })
}

const InfiniteScroller = (props: {
  children: any;
  loading: boolean;
  loadNext: () => void;
}) => {
  const { children, loading, loadNext } = props;
  const scrollListener = useRef(loadNext);

  useEffect(() => {
    scrollListener.current = loadNext;
  }, [loadNext]);

  const onScroll = () => {
    const documentHeight = document.documentElement.scrollHeight;
    const scrollDifference = Math.floor(window.innerHeight + window.scrollY);
    const scrollEnded = documentHeight == scrollDifference;

    if (scrollEnded && !loading) {
      scrollListener.current();
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", onScroll);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <>{children}</>;
};

export default function Index() {
  const { res } = useLoaderData<typeof loader>()
  const [initialData, setIntialData] = useState<Event[]>(res?.content!)
  const fetcher = useFetcher<{res: Page<Event>}>()
  useEffect(() => {
    if (!fetcher.data || fetcher.state === "loading") {
      return;
    }
    // If we have new data - append it
    if (fetcher.data) {
      const newItems = fetcher.data.res.content;
      console.log(fetcher.data)
      setIntialData((prevAssets) => [...prevAssets, ...newItems]);
    }
  }, [fetcher.data]);

  const loadNext = () => {
      if (initialData.length >= 12) {
        const page = fetcher.data?.res.pageable.pageNumber! + 1
        const query = `?index&page=${page}`;
        fetcher.load(query); // this call will trigger the loader with a new query
      }
  };
  return (
    <div className="px-24 space-y-10">
      <NavBar />
      <ImageGallery />
      <InfiniteScroller loadNext={loadNext} loading={fetcher.state === "loading"}>
        <PopularEvent events={initialData} />
      </InfiniteScroller>
    </div>
  );
}
