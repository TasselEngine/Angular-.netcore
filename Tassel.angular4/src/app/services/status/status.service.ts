import { JsonHelper } from './../../utils/helpers/typed_json.helper';
import { IError, HttpType } from 'ws-format-httprequest';
import { IdentityService } from './../identity/identity.service';
import { Logger } from 'ws-logger';
import { ServerService } from './../server/server.service';
import { RequestOptions, Http, Response, Headers } from '@angular/http';
import { IResponse } from './../../model/interfaces/response.interface';
import { HttpAsyncClientBase } from './../base/service.base';
import { Injectable } from '@angular/core';
import { StrictResult } from '../../utils/app.utils';
import { Status } from '../../model/models/status/status.model';
import { UserComment, ICommentCreate, ICommentDelete } from '../../model/app.model';

@Injectable()
export class StatusService extends HttpAsyncClientBase<IResponse> {

    public get Root() { return this.server.ServerApiRoot; }

    public get Options() { return this.identity.Options; }

    public get FormOptions() { return this.identity.FormOptions; }

    private logger: Logger<StatusService>;

    constructor(
        protected http: Http,
        private identity: IdentityService,
        private server: ServerService) {
        super(http);
        this.logger = this.logsrv.GetLogger('StatusService').SetModule('service');
    }

    public GetAllStatusAsync = async () => {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/status/all`, this.Options);
        this.apiLog([succeed, error, response], 'Try to fetch status-list', 'GetAllStatusAsync');
        return succeed ?
            StrictResult.Success(response.status, Status.ParseList(response.content), response.msg) :
            StrictResult.Failed<Status[]>(error);
    }

    public GetStatusAsync = async (status_id: string) => {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/status/${status_id}`, this.Options);
        this.apiLog([succeed, error, response], 'Try to get details of the status', 'GetStatusAsync');
        return succeed ?
            StrictResult.Success(response.status, Status.Parse(response.content), response.msg) :
            StrictResult.Failed<Status>(error);
    }

    public CreateStatusAsync = async (params: any) => {
        const [succeed, error, response] = await this.InvokeAsync(
            `${this.Root}/status/create`, this.FormOptions, HttpType.POST, JsonHelper.ToJSON(params));
        this.apiLog([succeed, error, response], 'Try to create a new status', 'CreateStatusAsync');
        return succeed ?
            StrictResult.Success(response.status, response.content as string, response.msg) :
            StrictResult.Failed<string>(error);
    }

    public LikeStatusAsync = async (sid: string, uid: string, uname: string) => {
        const [succeed, error, response] = await this.InvokeAsync(
            `${this.Root}/status/${sid}/like`, this.FormOptions, HttpType.PUT, JsonHelper.ToJSON({ uid: uid, user_name: uname }));
        this.apiLog([succeed, error, response], 'Try to like or dislike the status', 'LikeStatusAsync');
        return succeed ?
            StrictResult.Success(response.status, response.content as string, response.msg) :
            StrictResult.Failed<string>(error);
    }

    public AddCommentAsync = async (sid: string, params: ICommentCreate) => {
        const [succeed, error, response] = await this.InvokeAsync(
            `${this.Root}/status/${sid}/comment`, this.FormOptions, HttpType.POST, JsonHelper.ToJSON(params));
        this.apiLog([succeed, error, response], 'Try to add comment fot the status', 'AddCommentAsync');
        return succeed ?
            StrictResult.Success(response.status, UserComment.Parse(response.content), response.msg) :
            StrictResult.Failed<UserComment>(error);
    }

    public DeleteCommentAsync = async (sid: string, p: ICommentDelete) => {
        const [succeed, error, response] = await this.InvokeAsync(
            `${this.Root}/status/${sid}/comment?id=${sid || p.id}&comt_id=${p.com_id}&is_reply=${p.is_reply}&reply_id=${p.reply_id || ''}`, this.Options, HttpType.DELETE);
        this.apiLog([succeed, error, response], 'Try to delete comment fot the status', 'DeleteCommentAsync');
        return succeed ?
            StrictResult.Success(response.status, null as any, response.msg) :
            StrictResult.Failed<any>(error);
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
