import { FormatHttpAsyncClient } from 'ws-format-httprequest';
import { LogType, LoggerService, Logger } from 'ws-logger';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { IResponse } from '../../model/interfaces/response.interface';

@Injectable()
export class IdentityService extends FormatHttpAsyncClient<IResponse> {

    private username: string;
    public get UserName() { return this.username; }
    public set UserName(value: string) { this.username = value; }

    private logger: Logger<IdentityService>;

    constructor(
        protected http: Http,
        private lgsrv: LoggerService) {
        super(http);
        this.UserName = 'wallace';
        this.logger = lgsrv.GetLogger(IdentityService).SetModule('service');
    }

}
