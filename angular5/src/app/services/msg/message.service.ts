import { Injectable } from '@angular/core';
import { HttpAsyncClientBase } from './../base/service.base';
import { IResponse, UserMessage } from '../../model/app.model';
import { ServerService } from '../server/server.service';
import { HttpClient } from '@angular/common/http';
import { IdentityService } from '../identity/identity.service';
import { StrictResult, UrlGenerator } from '../../utils/app.utils';

@Injectable()
export class MessageService extends HttpAsyncClientBase<IResponse> {

    public get Root() { return this.server.ServerApiRoot; }

    public get Options() { return this.identity.Options; }

    public get FormOptions() { return this.identity.FormOptions; }

    private news: UserMessage[];
    public get Unread() { return this.news || []; }

    private timer: any;

    constructor(
        private identity: IdentityService,
        private server: ServerService,
        protected http: HttpClient) {
        super(http);
        this.identity.OnLogined.subscribe(() => this.StartMessageFetch());
        this.identity.OnLogout.subscribe(() => this.StopMessageFetch());
    }

    public async StartMessageFetch() {
        const [succeed, code, error, unreads] = await this.GetUserMessagesAsync(1000, null, true);
        if (succeed && code === 0) {
            this.news = unreads;
        }
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.StartMessageFetch(), 30000);
    }

    public StopMessageFetch() {
        clearTimeout(this.timer);
    }

    public GetUserMessagesAsync = async (count = 20, before?: number, unread?: boolean) => {
        const generator = new UrlGenerator(this.Root).section(['message', 'fetch']).query('before', before).query('unread', unread).query('count', count);
        const [succeed, error, response] = await this.InvokeAsync(generator.toString(), this.Options);
        return succeed ?
            StrictResult.Success(response.status, UserMessage.ParseList(response.content || []), response.msg) :
            StrictResult.Failed<UserMessage[]>(error);
    }

    // public ReadMessagesAsync = async (count = 20, before?: number, unread?: boolean) => {
    //     const [succeed, error, response] = await this.InvokeAsync(
    //         `${this.Root}/message/fetch?count=${count}&before=${before || null}&unread=${unread || null}`, this.Options);
    //     return succeed ?
    //         StrictResult.Success(response.status, response.content as any, response.msg) :
    //         StrictResult.Failed<any>(error);
    // }

}
