import { redirect } from "@remix-run/node"
import { getSession, destroySession, commitSession } from "../sessions"
import { UserClaim } from "~/data/entity/auth/UserClaim"
import { jwtDecode } from "jwt-decode"

export const getAuthSession = (request: Request) => {
    const cookie = request.headers.get("Cookie")
    return getSession(cookie)
}

export const logoutAuth = async (request: Request) => {
    const session = await getAuthSession(request)
    return redirect("/", {
        headers: {
            "Set-Cookie": await destroySession(session)
        }
    })
}

export const createAuthSession = async (request: Request, jwtToken: string, to: string = "/") => {
    const session = await getAuthSession(request);
    session.set("jwtToken", jwtToken)
    return redirect(to, {
        headers: {
            "Set-Cookie": await commitSession(session, {
                maxAge: 60 * 60 * 24 * 345,
            }),
        }
    })
}

export const getAuthToken = async (request: Request): Promise<string | undefined> => {
    const session = await getAuthSession(request)
    return session.get("jwtToken")
}

export const getUserClaim = async (request: Request): Promise<UserClaim | undefined> => {
    return new Promise(async (resolve: any, reject: any) => {
        try {
            const token = await getAuthToken(request)
            if(token !== undefined) {
                const dataClaim = jwtDecode<UserClaim>(token)
                resolve(dataClaim)
            } else {
                resolve(undefined)
            }
        } catch(err) {
            reject(err)
        }
    })
}