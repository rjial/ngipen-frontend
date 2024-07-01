export interface LoaderResI<T, E extends boolean = boolean> {
    errorr: E;
    message: string;
    data: E extends true ? undefined : T;
}

type ErrorLoaderRes = {
    error: boolean
}

export type LoaderRes<T> = {
    error: true;
    message: string;
    data: undefined;
} & {
    error: false;
    message: string;
    data: T
}