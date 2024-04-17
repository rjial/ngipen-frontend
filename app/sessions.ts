import { createCookieSessionStorage } from "@remix-run/node"

type SessionData = {
    jwtToken: string
}

type SessionFlashData = {
    error: string;
  };
  

export const sessionStorage = createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
        name: "__ngipenSession",
        httpOnly: true,
        maxAge: 60,
        path: "/",
        sameSite: "lax",
        secrets: ["ngipensecret"],
        secure: true,
    }
})

export const {getSession, commitSession, destroySession} = sessionStorage