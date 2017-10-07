import { IError } from 'ws-format-httprequest';

export const SrvTimeFormat = /(.+?)-(.+?)-(.+?)T(.+?):(.+?):(.+?).([0-9]{3}).+/;

export type APIResult = [boolean, IError, IResponse];

export interface IResponse {
    status: number;
    msg: string;
    content: any;
    [propName: string]: any;
}

export enum ServerStatus {
    Succeed = 0,
    LoginFailed = 1,
    RegisterFailed = 2,
    UserNotFound = 3,
    UserExist = 4,
    WeiboAccessFailed = 120,
    WeiboInfosFetchFailed = 121,
    WeiboUserCheckFailed = 122,
    WeiboDetailsNotFound = 123,
    Error = 255
}

