export class Response<T> {
    constructor(
        message: string,
        status_code: number,
        data?: T
    ) {
        this.message =  message;
        this.status_code = status_code;
        this.data = data
    }
    message: string;
    status_code: number;
    data?: T
}