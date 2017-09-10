import { LogType, LoggerService, Logger } from 'ws-logger';
import { AsyncableApiServiceBase } from './../base/service.base';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class IdentityService extends AsyncableApiServiceBase {

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
        this.logger.Debug(['Identity init.', 'details for development.', { name: 'shabi' }], 'constructor');
    }

}
