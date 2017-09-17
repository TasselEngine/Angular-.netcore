import { FormatHttpAsyncClient, HttpType } from 'ws-format-httprequest';
import { LogType, LoggerService, Logger } from 'ws-logger';
import { Injectable } from '@angular/core';
import { RequestOptions, Http, Response, Headers } from '@angular/http';
import { IResponse } from '../../model/interfaces/response.interface';

@Injectable()
export class IdentityService extends FormatHttpAsyncClient<IResponse> {

    private username: string;
    public get UserName() { return this.username; }
    public set UserName(value: string) { this.username = value; }

    private _uuid: string;

    public get Root() { return 'http://localhost:8081/api'; }

    private formOptions: RequestOptions;
    public get FormOptions() { return this.formOptions; }

    private options: RequestOptions;
    public get Options() { return this.options; }

    private logger: Logger<IdentityService>;

    constructor(
        protected http: Http,
        private lgsrv: LoggerService) {
        super(http);
        this.UserName = 'wallace';
        this.logger = lgsrv.GetLogger(IdentityService).SetModule('service');
        this.options = new RequestOptions();
        const headers = new Headers({ 'Content-Type': 'application/json' });
        this.formOptions = new RequestOptions({ headers: headers });
    }

    public TryRegisterAsync = async (userName: string, psd: string) => {
        const [succeed, error, response] = await this.InvokeAsync(
            `${this.Root}/user/register`, this.formOptions, HttpType.POST, JSON.stringify({ user: userName, psd: psd }));
        if (succeed) {
            console.log(response);
        }
    }

    public TryLoginAsync = async (userName: string, psd: string) => {
        const [succeed, error, response] = await this.InvokeAsync(
            `${this.Root}/user/login`, this.formOptions, HttpType.POST, JSON.stringify({ user: userName, psd: psd }));
        if (succeed) {
            console.log(response);
            this._uuid = response.content.uuid;
            const headers = new Headers({ 'Authorization': 'Bearer ' + response.content.token });
            this.options = new RequestOptions({ headers: headers });
            console.log(this.options);
        }
    }

    public TryGetAllUsersAsync = async () => {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/user`, this.Options);
        if (succeed) {
            console.log(response);
        }
    }

    public TryGetUserDetailsAsync = async (uuid?: string) => {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/user/${uuid || this._uuid}`, this.Options);
        if (succeed) {
            console.log(response);
        }
    }

}
