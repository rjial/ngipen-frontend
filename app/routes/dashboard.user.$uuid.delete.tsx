import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Link, NavLink, useLoaderData, useLocation } from "@remix-run/react";
import { ArrowLeft, CalendarDaysIcon, Pencil, PencilIcon, SearchIcon, Trash, UserPlusIcon } from "lucide-react";
import { useEffect } from "react";
import { UserItem } from "~/data/entity/auth/User";
import { Page } from "~/data/entity/common/Page";
import { IUserService } from "~/service/user/IUserService";
import { destroySession } from "~/sessions";
import { getAuthSession } from "~/utils/authUtil";
import { levelName } from "~/utils/levelUtil";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    try {
        const uuid = params.uuid || ""
        // const size = Number(url.searchParams.get("size")) || 10
        const userService = new IUserService()
        const res = await userService.deleteUser({ uuid: uuid, request: request })
        if (res.status_code == 200) {
            return redirect("/dashboard/user")
            // return json({ error: false, message: res.message, data: res.data })
        } else if(res.status_code == 401) {
            const session = await getAuthSession(request)
            return redirect("/login", {
                headers: {
                    "Set-Cookie": await destroySession(session)
                }
            })
        } else {
            return redirect("/dashboard/user")
        }
    } catch (err) {
        //@ts-ignore
        return redirect("/dashboard/user")
    }
}