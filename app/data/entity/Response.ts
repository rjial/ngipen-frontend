export class Response<T> {
    constructor(
        message: string,
        statusCode: number,
        data?: T
    ) {
        this.message =  message;
        this.statusCode = statusCode;
        this.data = data
    }
    message: string;
    statusCode: number;
    data?: T
}