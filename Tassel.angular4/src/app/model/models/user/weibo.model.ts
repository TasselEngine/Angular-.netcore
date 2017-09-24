import { SrvTimeFormat } from './../../interfaces/response.interface';
import { serializeAs, deserializeAs } from 'cerialize';
import { FormatTime, JsonHelper } from '../../../utils/app.utils';
import { IWeiboUser } from './user.contract';

export class WeiboUser {

    @serializeAs('id')
    @deserializeAs(Number, 'id')
    private id: number;
    public get ID(): number { return this.id; }

    @serializeAs('uid')
    @deserializeAs('uid')
    private uid: string;
    public get UID(): string { return this.uid; }

    @serializeAs('screen_name')
    @deserializeAs('screen_name')
    private screen_name: string;
    public get ScreenName(): string { return this.screen_name; }

    @serializeAs('description')
    @deserializeAs('description')
    private description: string;
    public get Description(): string { return this.description; }

    @serializeAs('domain')
    @deserializeAs('domain')
    private domain: string;
    public get Domain(): string { return this.domain; }

    @serializeAs('avatar_url')
    @deserializeAs('avatar_url')
    private avatar_url: string;
    public get AvatarUrl(): string { return this.avatar_url; }

    @serializeAs('create_time')
    @deserializeAs('create_time')
    private create_time: string;
    public get CreateTime(): FormatTime {
        return FormatTime.Parse(SrvTimeFormat, this.create_time, 8);
    }

    @serializeAs('update_time')
    @deserializeAs('update_time')
    private update_time: string;
    public get UpdateTime(): FormatTime {
        return FormatTime.Parse(SrvTimeFormat, this.update_time, 8);
    }

    public static Parse = (iuser: IWeiboUser): WeiboUser => JsonHelper.FromJson<WeiboUser>(JsonHelper.ToJSON(iuser), WeiboUser);

}
