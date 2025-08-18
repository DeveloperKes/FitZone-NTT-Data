export interface ResponseData<T> {
    message: string,
    code: number,
    data: T,
    error: any
}