import { IError } from 'ws-format-httprequest';

export type APIResult = [boolean, IError, IResponse];

export interface IResponse {
    status: number;
    msg: string;
    content: any;
    [propName: string]: any;
}

export const SrvTimeFormat = '(.+?)-(.+?)-(.+?)T(.+?):(.+?):(.+?).([0-9]{3}).+';

