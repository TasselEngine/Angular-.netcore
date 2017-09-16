import { IError } from 'ws-format-httprequest';

export type APIResult = [boolean, IError, IResponse];

export interface IResponse {
    status: number;
    msg: string;
    [propName: string]: any;
}

