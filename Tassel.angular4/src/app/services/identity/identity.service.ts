import { HttpType } from 'ws-format-httprequest';
import { LogType, LoggerService, Logger } from 'ws-logger';
import { Injectable } from '@angular/core';
import { RequestOptions, Http, Response, Headers } from '@angular/http';
import { IResponse } from '../../model/interfaces/response.interface';
import { ServerService } from '../server/server.service';
import { HttpAsyncClientBase } from '../base/service.base';

@Injectable()
export class IdentityService extends HttpAsyncClientBase<IResponse> {

    private username: string;
    public get UserName() { return this.username; }
    public set UserName(value: string) { this.username = value; }

    private _uuid: string;

    public get Root() { return this.server.ServerApiRoot; }

    private formOptions: RequestOptions;
    public get FormOptions() { return this.formOptions; }

    private options: RequestOptions;
    public get Options() { return this.options; }

    private logger: Logger<IdentityService>;

    constructor(
        protected http: Http,
        private server: ServerService) {
        super(http);
        this.UserName = 'wallace';
        this.logger = this.logsrv.GetLogger(IdentityService).SetModule('service');
        this.options = new RequestOptions();
        this.formOptions = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) });
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
            this._uuid = response.content.uuid;
            const headers = new Headers({ 'Authorization': 'Bearer ' + response.content.token });
            this.options = new RequestOptions({ headers: headers });
        }
    }

    public TryWeiboAccessAsync = async (code: string, redirect_url: string) => {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/user/weibo_access?code=${code}&redirect_url=${redirect_url}`, this.options);
        if (succeed) {
            console.log(response);
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
