import axios, { AxiosInstance, AxiosResponse } from "axios";
import {getSession, commitSession, destroySession} from "../sessions"


export abstract class HttpClient {
    constructor(request: Request | undefined = undefined) {
        this.request = request ?? undefined;
    }
    protected request: Request | undefined;
    protected instance: AxiosInstance | undefined;

    protected baseUrl = process.env.IS_PRODUCTION ? process.env.PRODUCTION_URL : process.env.DEVELOPMENT_URL

    protected createInstance(): AxiosInstance {
        if (this.instance == undefined) {
            this.instance = axios.create({
                baseURL: this.baseUrl,
                headers: {
                    "Content-Type": "application/json"
                }
            })
        }
        this.initializeResponseInterceptor();
        return this.instance;
    }

    private initializeResponseInterceptor = async () => {
        this.instance?.interceptors.response.use(this.handleResponse, this.handleError);
        if (this.request != undefined) {
            const token = await getSession(this.request.headers.get("Cookies"));
            this.instance?.interceptors.request.use((config: any) => {
                config.headers = {
                    Authorization: `Bearer ${token.get("jwtToken")}`,
                };
                return config;
            });
        }
    };


    private handleResponse = ({ data }: AxiosResponse) => data;

    private handleError = (error: any) => Promise.reject(error);
}