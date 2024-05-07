import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { IEventService } from "~/service/events/IEventService.server";
import { destroySession } from "~/sessions";
import { getAuthSession } from "~/utils/authUtil";

export const loader = async ({request, params}: LoaderFunctionArgs) => {
    const eventService = new IEventService()
    try {
        const eventUuid = params.uuid || ""
        const eventRes = await eventService.verifyEvent(eventUuid, request)
        if (eventRes.status_code == 200) {
            // const jenisTiketRes = await eventService.getJenisTiket(eventRes.data?.uuid!)
            return redirect(`/dashboard/event/${eventUuid}`)
            // return json({ error: false, message: eventRes.message, data: eventRes.data })
        } else if(eventRes.status_code == 401) {
            const session = await getAuthSession(request)
            return redirect("/login", {
                headers: {
                    "Set-Cookie": await destroySession(session)
                }
            })
        } else {
            return redirect(`/dashboard/event/${eventUuid}`)
        }
    } catch(err) {
        // @ts-ignore
        return redirect(`/dashboard/event/${eventUuid}`)
    }
}