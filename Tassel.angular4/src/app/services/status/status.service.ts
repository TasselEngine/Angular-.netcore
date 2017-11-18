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
import { UserComment, ICommentCreate, ICommentDelete, ServerStatus, Status } from '../../model/app.model';
import { ResourcesService } from './../resources/resources.service';
import { FormatService } from './../format/format.service';

@Injectable()
export class StatusService extends HttpAsyncClientBase<IResponse> {

    public get Root() { return this.server.ServerApiRoot; }

    public get Options() { return this.identity.Options; }

    public get FormOptions() { return this.identity.FormOptions; }

    private cacheStamp: Date;
    private cacheStatus: Status[] = [];

    private logger: Logger<StatusService>;

    constructor(
        protected http: Http,
        private identity: IdentityService,
        private resources: ResourcesService,
        private formater: FormatService,
        private server: ServerService) {
        super(http);
        this.logger = this.logsrv.GetLogger('StatusService').SetModule('service');
    }

    public async GetAndRefreshStatus(from: number = 0, take = 5) {
        const stamp = new Date();
        if (from !== 0) {
            // DO IMCRE LOAD
            return await this.getStatusColl(from, take);
        }
        if (!this.cacheStamp || stamp.getTime() - this.cacheStamp.getTime() > 600000) {
            // NEED RELOAD RESOURCES
            return await this.getStatusColl(0, take);
        } else {
            // DON'T NEED RELOAD
            return this.cacheStatus;
        }
    }

    private async getStatusColl(before: number, take = 10) {
        const [succeed, status, error, response] = await this.GetStatusSelectAsync(before, take);
        if (succeed && status === ServerStatus.Succeed) {
            response.forEach(sta => {
                sta.Content = removeBasSticker(sta.Content);
                sta.Content = this.formater.ImageTickParse(sta.Content, this.resources.AllStickersGroup, 22);
            });
            this.cacheStatus.push(...response);
            this.cacheStamp = new Date();
            return response;
        } else {
            return [];
        }
    }

    public async GetAllStatusAsync() {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/status/all`, this.Options);
        this.apiLog([succeed, error, response], 'Try to fetch status-list', 'GetAllStatusAsync');
        return succeed ?
            StrictResult.Success(response.status, Status.ParseList(response.content), response.msg) :
            StrictResult.Failed<Status[]>(error);
    }

    public async GetStatusSelectAsync(before: number, take = 10) {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/status/gets?before=${before}&take=${take}`, this.Options);
        this.apiLog([succeed, error, response], `Try to fetch ${take} status before stamp = ${before}`, 'GetStatusSelectAsync');
        return succeed ?
            StrictResult.Success(response.status, Status.ParseList(response.content), response.msg) :
            StrictResult.Failed<Status[]>(error);
    }

    public async GetStatusAsync(status_id: string) {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/status/${status_id}`, this.Options);
        this.apiLog([succeed, error, response], 'Try to get details of the status', 'GetStatusAsync');
        return succeed ?
            StrictResult.Success(response.status, Status.Parse(response.content), response.msg) :
            StrictResult.Failed<Status>(error);
    }

    public async CreateStatusAsync(params: any) {
        const [succeed, error, response] = await this.InvokeAsync(
            `${this.Root}/status/create`, this.FormOptions, HttpType.POST, JsonHelper.ToJSON(params));
        this.apiLog([succeed, error, response], 'Try to create a new status', 'CreateStatusAsync');
        return succeed ?
            StrictResult.Success(response.status, response.content as string, response.msg) :
            StrictResult.Failed<string>(error);
    }

    public async LikeStatusAsync(sid: string, uid: string, uname: string) {
        const [succeed, error, response] = await this.InvokeAsync(
            `${this.Root}/status/${sid}/like`, this.FormOptions, HttpType.PUT, JsonHelper.ToJSON({ uid: uid, user_name: uname }));
        this.apiLog([succeed, error, response], 'Try to like or dislike the status', 'LikeStatusAsync');
        return succeed ?
            StrictResult.Success(response.status, response.content as string, response.msg) :
            StrictResult.Failed<string>(error);
    }

    public async AddCommentAsync(sid: string, params: ICommentCreate) {
        const [succeed, error, response] = await this.InvokeAsync(
            `${this.Root}/status/${sid}/comment`, this.FormOptions, HttpType.POST, JsonHelper.ToJSON(params));
        this.apiLog([succeed, error, response], 'Try to add comment fot the status', 'AddCommentAsync');
        return succeed ?
            StrictResult.Success(response.status, UserComment.Parse(response.content), response.msg) :
            StrictResult.Failed<UserComment>(error);
    }

    public async DeleteCommentAsync(sid: string, p: ICommentDelete) {
        const [succeed, error, response] = await this.InvokeAsync(
            `${this.Root}/status/${sid}/comment?id=${sid || p.id}&comt_id=${p.com_id}&is_reply=${p.is_reply}&reply_id=${p.reply_id || ''}`, this.Options, HttpType.DELETE);
        this.apiLog([succeed, error, response], 'Try to delete comment fot the status', 'DeleteCommentAsync');
        return succeed ?
            StrictResult.Success(response.status, null as any, response.msg) :
            StrictResult.Failed<any>(error);
    }

    public async DeleteStatusAsync(status_id: string) {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/status/${status_id}`, this.Options, HttpType.DELETE);
        this.apiLog([succeed, error, response], 'Try to delete a status', 'DeleteStatusAsync');
        return succeed ?
            StrictResult.Success(response.status, response.content as string, response.msg) :
            StrictResult.Failed<string>(error);
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

function removeBasSticker(value: string): string {
    if (value.length < 60) {
        return value;
    }
    let val = value.substr(0, 60);
    const last = val.lastIndexOf(']');
    if (last < 0 || last === val.length - 1) {
        return val + '...';
    }
    const end = val.lastIndexOf('[');
    if (end < last) {
        return val + '...';
    }
    val = val.substr(0, end);
    return val + '...';
}

