import { JsonHelper } from './../../utils/helpers/typed_json.helper';
import { IError, HttpType } from 'ws-format-httprequest';
import { Logger } from 'ws-logger';
import { HttpAsyncClientBase } from './../base/service.base';
import { Http } from '@angular/http';
import { IdentityService } from './../identity/identity.service';
import { ServerService } from './../server/server.service';
import { Injectable } from '@angular/core';
import { IResponse } from '../../model/app.model';
import { StrictResult } from '../../utils/app.utils';

@Injectable()
export class AdminService extends HttpAsyncClientBase<IResponse> {

    public get Root() { return this.server.ServerApiRoot; }

    public get Options() { return this.identity.Options; }

    public get FormOptions() { return this.identity.FormOptions; }

    private checked = false;
    public get AccessChecked() { return this.checked; }

    private logger: Logger<AdminService>;

    constructor(
        protected http: Http,
        private identity: IdentityService,
        private server: ServerService) {
        super(http);
        this.logger = this.logsrv.GetLogger('AdminService').SetModule('service');
    }

    public readonly CheckAccess = (checked: boolean = true) => {
        this.checked = checked;
    }

    public readonly CheckAdminAsync = async () => {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/admin/is_admin`, this.Options);
        this.apiLog([succeed, error, response], 'Try to check if the user has the admin-access', 'CheckAdminAsync');
        return succeed ?
            StrictResult.Success(response.status, response.content as boolean, response.msg) :
            StrictResult.Failed<boolean>(error);
    }

    public readonly UploadImageAsync = async (file: string) => {
        const [succeed, error, response] = await this.InvokeAsync(
            `${this.Root}/static/image`, this.FormOptions, HttpType.POST, JsonHelper.ToJSON({ file: file }));
        this.apiLog([succeed, error, response], 'Try to upload a file', 'UploadImageAsync');
        return succeed ?
            StrictResult.Success(response.status, response.content as any, response.msg) :
            StrictResult.Failed<any>(error);
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
