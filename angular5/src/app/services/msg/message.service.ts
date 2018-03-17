import { Injectable } from '@angular/core';
import { HttpAsyncClientBase } from './../base/service.base';
import { IResponse, UserMessage, MessageType } from '../../model/app.model';
import { ServerService } from '../server/server.service';
import { HttpClient } from '@angular/common/http';
import { IdentityService } from '../identity/identity.service';
import { StrictResult, UrlGenerator } from '../../utils/app.utils';
import { FormatService } from '../format/format.service';
import { ResourcesService } from '../resources/resources.service';
import { HttpType } from 'ws-format-httprequest';

@Injectable()
export class MessageService extends HttpAsyncClientBase<IResponse> {

    public get Root() { return this.server.ServerApiRoot; }

    public get Options() { return this.identity.Options; }

    public get FormOptions() { return this.identity.FormOptions; }

    private messages: UserMessage[] = [];
    public get Messages() { return this.messages || (this.messages = []); }

    private unread: UserMessage[] = [];
    public get Unread() { return this.unread || (this.unread = []); }

    private likes: UserMessage[] = [];
    public get Likes() { return this.likes || (this.likes = []); }

    private comments: UserMessage[] = [];
    public get Comments() { return this.comments || (this.comments = []); }

    private isinit = true;
    public get Loaded() { return !this.isinit; }

    private timer: any;

    constructor(
        private identity: IdentityService,
        private formater: FormatService,
        private resources: ResourcesService,
        private server: ServerService,
        protected http: HttpClient) {
        super(http);
        this.identity.OnLogined.subscribe(() => this.StartMessageFetch());
        this.identity.OnLogout.subscribe(() => this.StopMessageFetch());
    }

    public async StartMessageFetch() {
        let after = null;
        if (this.Unread.length > 0) {
            after = this.Unread[0].CreateTimeUnix;
        }
        const [succeed, code, error, unreads] = await this.GetUserMessagesAsync(50, null, after, this.isinit ? null : true);
        if (succeed && code === 0) {
            unreads.forEach(msg => msg.Normalize((content: string) => {
                const value = removeBasSticker(content);
                return this.formater.ImageTickParse(value, this.resources.AllStickersGroup);
            }));
            this.messages.unshift(...unreads);
        }
        this.calculate();
        this.isinit = false;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.StartMessageFetch(), 30000);
    }

    public StopMessageFetch() {
        this.messages = [];
        this.unread = [];
        this.likes = [];
        this.comments = [];
        this.isinit = true;
        clearTimeout(this.timer);
    }

    public async Read(model: UserMessage) {
        if (!model) { return; }
        const [succeed, code, error, _] = await this.ReadMessagesAsync([model.ID]);
        if (succeed && code === 0) {
            model.Read();
            this.calculate();
        }
    }

    private calculate() {
        this.unread = this.messages.filter(i => !i.IsRead);
        this.likes = this.messages.filter(i => i.MessageType === MessageType.Like);
        this.comments = this.messages.filter(i => (i.MessageType === MessageType.Comment || i.MessageType === MessageType.Reply));
    }

    public GetUserMessagesAsync = async (count = 20, before?: number, after?: number, unread?: boolean) => {
        const generator = new UrlGenerator(this.Root)
            .section(['message', 'fetch'])
            .query('before', before)
            .query('after', after)
            .query('unread', unread)
            .query('count', count);
        const [succeed, error, response] = await this.InvokeAsync(generator.toString(), this.Options);
        return succeed ?
            StrictResult.Success(response.status, UserMessage.ParseList(response.content || []), response.msg) :
            StrictResult.Failed<UserMessage[]>(error);
    }

    public ReadMessagesAsync = async (ids: string[]) => {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/message/read`, this.FormOptions, HttpType.PUT, JSON.stringify({ messages: ids || [] }));
        return succeed ?
            StrictResult.Success(response.status, response.content as null, response.msg) :
            StrictResult.Failed<null>(error);
    }

}

function removeBasSticker(value: string): string {
    if (!value) { return ""; }
    if (value.length < 240) {
        return value;
    }
    let val = value.substr(0, 240);
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
