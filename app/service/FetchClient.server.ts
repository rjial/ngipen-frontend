import { getSession } from "~/sessions";

interface postArgs {
    resource: string
}

export class FetchClient {

    async get<T>(resource: string, request?: Request | undefined, config?: RequestInit | undefined): Promise<T> {
        const header = new Headers()
        header.set('Content-Type', 'application/json')
        if (request !== undefined) {
            const token = await getSession(request.headers.get("Cookies"));
            header.append("Authorization", `Bearer ${token.get("jwtToken")}`)
        }
        const url = new URL(resource, process.env.IS_PRODUCTION ? process.env.PRODUCTION_URL : process.env.DEVELOPMENT_URL)
        const response = await fetch(url, { ...config, headers: header, method: "GET",})
        console.log(response)
        return response.json() as T
    }

    async post<T, DTOType>(resource: string, body?: DTOType, request?: Request | undefined, config?: RequestInit | undefined): Promise<T> {
        const header = new Headers()
        header.set('Content-Type', 'application/json')
        if (request !== undefined) {
            const token = await getSession(request.headers.get("Cookies"));
            header.append("Authorization", `Bearer ${token.get("jwtToken")}`)
        }
        const url = new URL(resource, process.env.IS_PRODUCTION ? process.env.PRODUCTION_URL : process.env.DEVELOPMENT_URL)
        const response = await fetch(url, { ...config, headers: header, method: "POST", body: JSON.stringify(body) })
        console.log(JSON.stringify(body))
        console.log(response)
        return response.json() as T
    }

    async put<T, DTOType>(resource: string, body?: DTOType, request?: Request | undefined, config?: RequestInit | undefined): Promise<T> {
        const header = new Headers()
        header.set('Content-Type', 'application/json')
        if (request !== undefined) {
            const token = await getSession(request.headers.get("Cookies"));
            header.append("Authorization", `Bearer ${token.get("jwtToken")}`)
        }
        const url = new URL(resource, process.env.IS_PRODUCTION ? process.env.PRODUCTION_URL : process.env.DEVELOPMENT_URL)
        const response = await fetch(url, { ...config, headers: header, method: "PUT", body: JSON.stringify(body) })
        console.log(response)
        return response.json() as T
    }

    async patch<T, DTOType>(resource: string, body?: DTOType, request?: Request | undefined, config?: RequestInit | undefined): Promise<T> {
        const header = new Headers()
        header.set('Content-Type', 'application/json')
        if (request !== undefined) {
            const token = await getSession(request.headers.get("Cookies"));
            header.append("Authorization", `Bearer ${token.get("jwtToken")}`)
        }
        const url = new URL(resource, process.env.IS_PRODUCTION ? process.env.PRODUCTION_URL : process.env.DEVELOPMENT_URL)
        const response = await fetch(url, { ...config, headers: header, method: "PATCH", body: JSON.stringify(body) })
        console.log(response)
        return response.json() as T
    }

    async delete<T, DTOType>(resource: string, body?: DTOType, request?: Request | undefined, config?: RequestInit | undefined): Promise<T> {
        const header = new Headers()
        header.set('Content-Type', 'application/json')
        if (request !== undefined) {
            const token = await getSession(request.headers.get("Cookies"));
            header.append("Authorization", `Bearer ${token.get("jwtToken")}`)
        }
        const url = new URL(resource, process.env.IS_PRODUCTION ? process.env.PRODUCTION_URL : process.env.DEVELOPMENT_URL)
        const response = await fetch(url, { ...config, headers: header, method: "DELETE", body: JSON.stringify(body) })
        console.log(response)
        return response.json() as T
    }

}