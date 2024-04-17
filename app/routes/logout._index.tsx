import { LoaderFunctionArgs } from "@remix-run/node";
import { logoutAuth } from "~/utils/authUtil";

export const loader = async({request}: LoaderFunctionArgs) => {
    return logoutAuth(request)
}