import { IError } from 'ws-format-httprequest';
import { Logger } from 'ws-logger';
import { HttpAsyncClientBase } from './../base/service.base';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { IdentityService } from './../identity/identity.service';
import { ServerService } from './../server/server.service';
import { IResponse } from '../../model/app.model';
import { StrictResult } from '../../utils/app.utils';

@Injectable()
export class ResourcesService extends HttpAsyncClientBase<IResponse> {

    public get Root() { return this.server.ServerApiRoot; }

    public get Options() { return this.identity.Options; }

    public get FormOptions() { return this.identity.FormOptions; }

    private logger: Logger<ResourcesService>;

    constructor(
        protected http: Http,
        private identity: IdentityService,
        private server: ServerService) {
        super(http);
        this.logger = this.logsrv.GetLogger('ResourcesService').SetModule('service');
    }

    public readonly GetTiebaImagesAsync = async () => {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/static/tieba`, this.Options);
        this.apiLog([succeed, error, response], 'Try to get the middle tieba images group.', 'GetTiebaImagesAsync');
        return succeed ?
            StrictResult.Success(response.status, response.content as any[], response.msg) :
            StrictResult.Failed<any[]>(error);
    }

    private readonly apiLog = (result: [boolean, IError, IResponse], title: string, method: string, descrip?: string) => {
        const [succeed, error, response] = result;
        if (succeed) {
            this.logger.Debug([`[ API ]${title}`, ...(descrip ? [descrip, response] : [response])], method);
        } else {
            this.logger.Error([`[ API ]${title}`, 'Connect To Server Failed.', error], method);
        }
    }

}
