import { JsonHelper } from './../../utils/helpers/typed_json.helper';
import { IError, HttpType } from 'ws-format-httprequest';
import { Logger } from 'ws-logger';
import { HttpAsyncClientBase } from './../base/service.base';
import { HttpClient } from '@angular/common/http';
import { IdentityService } from './../identity/identity.service';
import { ServerService } from './../server/server.service';
import { Injectable } from '@angular/core';
import { IResponse, User } from '../../model/app.model';
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
        protected http: HttpClient,
        private identity: IdentityService,
        private server: ServerService) {
        super(http);
        this.logger = this.logsrv.GetLogger('AdminService').SetModule('service');
    }

    public CheckAccess(checked: boolean = true) {
        this.checked = checked;
    }

    public async GetAllAdminAsync() {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/admin/users?type=admin`, this.Options);
        this.apiLog([succeed, error, response], 'Try to get all admin-access users list', 'GetAllAdminAsync');
        return succeed ?
            StrictResult.Success(response.status, User.ParseList(response.content), response.msg) :
            StrictResult.Failed<User[]>(error);
    }

    public async GetAllCommonUserAsync() {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/admin/users?type=user`, this.Options);
        this.apiLog([succeed, error, response], 'Try to get all common-access users list', 'GetAllCommonUserAsync');
        return succeed ?
            StrictResult.Success(response.status, User.ParseList(response.content), response.msg) :
            StrictResult.Failed<User[]>(error);
    }

    public async GetAllCoreUserAsync() {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/admin/users?type=core`, this.Options);
        this.apiLog([succeed, error, response], 'Try to get all core-access users list', 'GetAllCoreUserAsync');
        return succeed ?
            StrictResult.Success(response.status, User.ParseList(response.content), response.msg) :
            StrictResult.Failed<User[]>(error);
    }

    public async CheckAdminAsync() {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/admin/is_admin`, this.Options);
        this.apiLog([succeed, error, response], 'Try to check if the user has the admin-access', 'CheckAdminAsync');
        return succeed ?
            StrictResult.Success(response.status, response.content as boolean, response.msg) :
            StrictResult.Failed<boolean>(error);
    }

    public async UploadImageAsync(file: string) {
        const [succeed, error, response] = await this.InvokeAsync(
            `${this.Root}/static/image`, this.FormOptions, HttpType.POST, JsonHelper.ToJSON({ file: file }));
        this.apiLog([succeed, error, response], 'Try to upload a file', 'UploadImageAsync');
        return succeed ?
            StrictResult.Success(response.status, response.content as any, response.msg) :
            StrictResult.Failed<any>(error);
    }

    private apiLog(result: [boolean, IError, IResponse], title: string, method: string, descrip?: string) {
        const [succeed, error, response] = result;
        if (succeed) {
            this.logger.Debug([`[ API ]${title}`, ...(descrip ? [descrip, response] : [response])], method);
        } else {
            this.logger.Error([`[ API ]${title}`, 'Connect To Server Failed.', error], method);
        }
    }

}
