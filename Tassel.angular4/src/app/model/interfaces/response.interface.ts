import { IError } from 'ws-format-httprequest';

export const SrvTimeFormat = /(.+?)-(.+?)-(.+?)T(.+?):(.+?):(.+?).([0-9]{3}).+/;

export type APIResult = [boolean, IError, IResponse];

export interface IResponse {
    status: number;
    msg: string;
    content: any;
    [propName: string]: any;
}

