
export type APIResult = [boolean, IError, IResponse];

export interface IResponse {
    status: number;
    msg: string;
    [propName: string]: any;
}

export interface IError {
    errors?: any;
    msg?: string;
    [propName: string]: any;
}
