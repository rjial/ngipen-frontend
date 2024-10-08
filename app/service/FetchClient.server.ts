import { Response } from "~/data/entity/Response";
import { getSession } from "~/sessions";
import { getAuthToken } from "~/utils/authUtil";

export class FetchClient {
    public getURL = (resource: string) => {
        const url = new URL(resource, process.env.NODE_ENV == "production" ? process.env.PRODUCTION_URL != undefined ? process.env.PRODUCTION_URL : "http://localhost:8080" : process.env.DEVELOPMENT_URL != undefined ? process.env.DEVELOPMENT_URL : "http://localhost:8080")
        console.log(process.env.IS_PRODUCTION)
        return url 
    }
    private getHeader = async (request: Request | undefined, multipart: Boolean = false): Promise<Headers> => {
        const header = new Headers()
        if (!multipart) header.set('Content-Type', 'application/json')
        if (request instanceof Request) {
            const token = await getAuthToken(request);
            if (token !== undefined) header.append("Authorization", `Bearer ${token}`)
        }
        return header
    }

    async get<T>(resource: string, request?: Request | undefined, config?: RequestInit | undefined): Promise<Response<T>> {
        try {
            const response = await fetch(this.getURL(resource), { ...config, headers: await this.getHeader(request), method: "GET", })
            const data = await response.json()
            return new Response<T>(data.message, data.status_code, data.data)
        } catch (exc) {
            console.error(exc)
            // @ts-ignore
            throw new Response(`Oh no! Something went wrong! ${exc.message}`, { status: 500 })
        }
    }

    async post<T, DTOType = FormData>(resource: string, body?: DTOType | FormData, request?: Request | undefined, config?: RequestInit | undefined): Promise<Response<T>> {
        try {
            console.log("getURL", this)
            const response = await fetch(this.getURL(resource), { ...config, headers: await this.getHeader(request, body instanceof FormData), method: "POST", body: body instanceof FormData ? body : JSON.stringify(body) })   
            const data = await response.json()
            return new Response<T>(data.message, data.status_code, data.data)
        } catch (exc) {
            console.error(exc)
            // @ts-ignore
            throw new Response(`Oh no! Something went wrong! ${exc.message}`, { status: 500 })
        }
    }

    async put<T, DTOType>(resource: string, body?: DTOType, request?: Request | undefined, config?: RequestInit | undefined): Promise<Response<T>> {
        try {
            console.log(body, "payload put")
            const response = await fetch(this.getURL(resource), { ...config, headers: await this.getHeader(request), method: "PUT", body: JSON.stringify(body) })
            const data = await response.json()
            console.log(data, "data put")
            return new Response<T>(data.message, data.status_code, data.data)
        } catch (exc) {
            console.error(exc)
            // @ts-ignore
            throw new Response(`Oh no! Something went wrong! ${exc.message}`, { status: 500 })
        }
    }

    async patch<T, DTOType>(resource: string, body?: DTOType, request?: Request | undefined, config?: RequestInit | undefined): Promise<Response<T>> {
        try {
            const response = await fetch(this.getURL(resource), { ...config, headers: await this.getHeader(request), method: "PATCH", body: JSON.stringify(body) })
            const data = await response.json()
            return new Response<T>(data.message, data.status_code, data.data)

        } catch (exc) {
            console.error(exc)
            // @ts-ignore
            throw new Response(`Oh no! Something went wrong! ${exc.message}`, { status: 500 })
        }
    }

    async delete<T, DTOType>(resource: string, body?: DTOType, request?: Request | undefined, config?: RequestInit | undefined): Promise<Response<T>> {
        try {
            const response = await fetch(this.getURL(resource), { ...config, headers: await this.getHeader(request), method: "DELETE", body: JSON.stringify(body) })
            const data = await response.json()
            return new Response<T>(data.message, data.status_code, data.data)

        } catch (exc) {
            console.error(exc)
            // @ts-ignore
            throw new Response(`Oh no! Something went wrong! ${exc.message}`, { status: 500 })
        }
    }

    async getBlob(resource: string, request?: Request | undefined, config?: RequestInit | undefined): Promise<Blob> {
        try {
            const response = await fetch(this.getURL(resource), {...config, headers: await this.getHeader(request), method: "GET"})
            const data = await response.blob()
            return data
        } catch(err) {
            // @ts-ignore
            throw new Response(`Oh no! Something went wrong! ${exc.message}`, { status: 500 })
        }
    }

}