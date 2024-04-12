import { createCookieSessionStorage } from "@remix-run/node"

type SessionData = {
    jwtToken: string
}

type SessionFlashData = {
    error: string;
  };
  

const {getSession, commitSession, destroySession} = createCookieSessionStorage<SessionData, SessionFlashData>({
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

export {getSession, commitSession, destroySession}