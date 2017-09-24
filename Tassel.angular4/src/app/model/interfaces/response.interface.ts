import { IError } from 'ws-format-httprequest';

export type APIResult = [boolean, IError, IResponse];

export interface IResponse {
    status: number;
    msg: string;
    content: any;
    [propName: string]: any;
}

export const SrvTimeFormat = /(.+?)-(.+?)-(.+?)T(.+?):(.+?):(.+?).([0-9]{3}).+/;
// export const SrvTimeFormat = '2017-09-24T03:33:03.8965564';

