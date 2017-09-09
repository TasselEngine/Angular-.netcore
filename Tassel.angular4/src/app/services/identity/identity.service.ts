import { LoggerService } from './../logger/logger.service';
import { AsyncableApiServiceBase } from './../base/service.base';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class IdentityService extends AsyncableApiServiceBase {

    private username: string;
    public get UserName() { return this.username; }
    public set UserName(value: string) { this.username = value; }

    constructor(
        protected http: Http,
        private logger: LoggerService<IdentityService>) {
        super(http);
        this.UserName = 'wallace';
        console.log(logger.GetLogger<IdentityService>(IdentityService));
    }

}
