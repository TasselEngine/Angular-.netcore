import { JsonHelper } from './../../utils/helpers/typed_json.helper';
import { IError, HttpType } from 'ws-format-httprequest';
import { IdentityService } from './../identity/identity.service';
import { Logger } from 'ws-logger';
import { ServerService } from './../server/server.service';
import { HttpClient } from '@angular/common/http';
import { IResponse } from './../../model/interfaces/response.interface';
import { HttpAsyncClientBase } from './../base/service.base';
import { Injectable } from '@angular/core';
import { StrictResult } from '../../utils/app.utils';

@Injectable()
export class UtilsService extends HttpAsyncClientBase<IResponse> {

    public get Root() { return this.server.ServerApiRoot; }

    public get Options() { return this.identity.Options; }

    public get FormOptions() { return this.identity.FormOptions; }

    private logger: Logger<UtilsService>;

    constructor(
        protected http: HttpClient,
        private identity: IdentityService,
        private server: ServerService) {
        super(http);
        this.logger = this.logsrv.GetLogger('UtilsService').SetModule('service');
    }

    private apiLog = (result: [boolean, IError, IResponse], title: string, method: string, descrip?: string) => {
        const [succeed, error, response] = result;
        if (succeed) {
            this.logger.Debug([`[ API ]${title}`, ...(descrip ? [descrip, response] : [response])], method);
        } else {
            this.logger.Error([`[ API ]${title}`, 'Connect To Server Failed.', error], method);
        }
    }

}
