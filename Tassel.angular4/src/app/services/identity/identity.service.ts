import { LoggerService, Logger } from 'ws-logger';
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
        this.logger.Debug(['title', 'dhjvasdvjsvjsdvjsvd', new Date()], 'this_method');
        this.logger.Warn(['nothing for', new Date()], '2method');
        this.logger.Error('nothing for', 'ssgsdrr');
        this.logger.Info({ name: 'dhvad', age: 50 }, '3mhgd');
        this.lgsrv.Info({ name: 'dhvad', age: 50 }, '3mhgd');
    }

}
