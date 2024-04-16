export class FetchClient {
    constructor(request: Request | undefined = undefined) {
        this.request = request ?? undefined;
    }
    request: Request | undefined;

    protected getUrl = (resource: string): URL => {
        return new URL(resource, process.env.IS_PRODUCTION ? process.env.PRODUCTION_URL : process.env.DEVELOPMENT_URL)
    }

    protected headerAuth = (): RequestInit => {
        const headerAuth: HeadersInit = typeof this.request != undefined ? {
            "Authorization": `Bearer`
        } : {}
        return {
            headers: {...headerAuth}
        }
    }

    async get<T>(resource: string, config?: RequestInit | undefined) {
        const response = await fetch(this.getUrl(resource), { ...config, ...this.headerAuth, method: "GET",})
        return response.json() as T
    }

    async post<T, DTOType>(resource: string, body?: DTOType, config?: RequestInit | undefined) {
        const response = await fetch(this.getUrl(resource), { ...config, ...this.headerAuth, method: "POST", body: JSON.stringify(body) })
        return response.json() as T
    }

    async put<T, DTOType>(resource: string, body?: DTOType, config?: RequestInit | undefined) {
        const response = await fetch(this.getUrl(resource), { ...config, ...this.headerAuth, method: "PUT", body: JSON.stringify(body) })
        return response.json() as T
    }

    async patch<T, DTOType>(resource: string, body?: DTOType, config?: RequestInit | undefined) {
        const response = await fetch(this.getUrl(resource), { ...config, ...this.headerAuth, method: "PATCH", body: JSON.stringify(body) })
        return response.json() as T
    }

    async delete<T, DTOType>(resource: string, body?: DTOType, config?: RequestInit | undefined) {
        const response = await fetch(this.getUrl(resource), { ...config, ...this.headerAuth, method: "DELETE", body: JSON.stringify(body) })
        return response.json() as T
    }

}