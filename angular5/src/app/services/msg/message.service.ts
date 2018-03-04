import { Injectable } from '@angular/core';
import { HttpAsyncClientBase } from './../base/service.base';
import { IResponse } from '../../model/app.model';
import { ServerService } from '../server/server.service';
import { HttpClient } from '@angular/common/http';
import { IdentityService } from '../identity/identity.service';
import { StrictResult } from '../../utils/app.utils';

@Injectable()
export class MessageService extends HttpAsyncClientBase<IResponse> {

    public get Root() { return this.server.ServerApiRoot; }

    public get Options() { return this.identity.Options; }

    public get FormOptions() { return this.identity.FormOptions; }

    private timer: any;

    constructor(
        private identity: IdentityService,
        private server: ServerService,
        protected http: HttpClient) {
        super(http);
        this.identity.OnLogined.subscribe(() => this.StartMessageFetch());
        this.identity.OnLogout.subscribe(() => this.StopMessageFetch());
    }

    public StartMessageFetch() {
        this.GetUserMessagesAsync(20);
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.StartMessageFetch(), 30000);
    }

    public StopMessageFetch() {
        clearTimeout(this.timer);
    }

    public GetUserMessagesAsync = async (count = 20, before?: number, unread?: boolean) => {
        const [succeed, error, response] = await this.InvokeAsync(
            `${this.Root}/message/fetch?count=${count}&before=${before || null}&unread=${unread || null}`, this.Options);
        return succeed ?
            StrictResult.Success(response.status, response.content as any, response.msg) :
            StrictResult.Failed<any>(error);
    }

}
