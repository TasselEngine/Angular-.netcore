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

    private readonly formOptions: RequestOptions;
    public get FormOptions() { return this.formOptions; }

    private readonly options: RequestOptions;
    public get Options() { return this.formOptions; }

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
            'http://localhost:56285/api/user/register', this.formOptions, HttpType.POST, JSON.stringify({ user: 'miao17game', psd: '2w3e4r5t' }));
        if (succeed) {
            console.log(response);
        }
    }

    public TryLoginAsync = async (userName: string, psd: string) => {
        const [succeed, error, response] = await this.InvokeAsync(
            'http://localhost:56285/api/user/login', this.formOptions, HttpType.POST, JSON.stringify({ user: 'miao17game', psd: '2w3e4r5t' }));
        if (succeed) {
            console.log(response);
        }
    }

}
