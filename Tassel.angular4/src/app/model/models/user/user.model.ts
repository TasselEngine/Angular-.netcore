import { IUserBase, UserType } from './user.contract';
import { SrvTimeFormat } from './../../interfaces/response.interface';
import { FormatTime } from 'ws-format-time';
import { serializeAs, deserialize, deserializeAs } from 'cerialize';
import { JsonHelper } from '../../../utils/app.utils';
import { WeiboUser } from './weibo.model';

export class User {

    @serializeAs('uuid')
    @deserializeAs('uuid')
    private uuid: string;
    public get UUID(): string { return this.uuid; }

    @serializeAs('role_id')
    @deserializeAs('role_id')
    private role_id: number;
    public get RoleID(): number { return this.role_id; }

    @serializeAs('user_name')
    @deserializeAs('user_name')
    private user_name: string;
    public get UserName(): string { return this.user_name; }

    @serializeAs('email')
    @deserializeAs('email')
    private email: string;
    public get Email(): string { return this.email; }

    @serializeAs('family_name')
    @deserializeAs('family_name')
    private family_name: string;
    public get FamilyName(): string { return this.family_name; }

    @serializeAs('given_name')
    @deserializeAs('given_name')
    private given_name: string;
    public get GivenName(): string { return this.given_name; }

    @serializeAs('gender')
    @deserializeAs('gender')
    private gender: number;
    public get Gender(): boolean { return this.gender === 0; }

    @serializeAs('birth_date')
    @deserializeAs('birth_date')
    private birth_date: string;
    public get BirthDate(): FormatTime {
        return FormatTime.Parse(SrvTimeFormat, this.birth_date, 8);
    }

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

    @serializeAs('weibo_id')
    @deserializeAs('weibo_id')
    private weibo_id: string;
    public get WeiboID(): string { return this.weibo_id; }

    @serializeAs('wechat_token')
    @deserializeAs('wechat_token')
    wechat_token: string;
    public get WechatID(): string { return this.wechat_token; }

    @serializeAs('qq_token')
    @deserializeAs('qq_token')
    private qq_token: string;
    public get QQID(): string { return this.qq_token; }

    @serializeAs('avatar')
    @deserializeAs('avatar')
    private avatar: string;
    public get Avatar(): string { return this.avatar; }

    private user_type: UserType = UserType.Base;
    public get UserType(): UserType { return this.user_type; }
    public set UserType(value: UserType) { this.user_type = value; }

    private wb_user: WeiboUser;
    public get WeiboUser(): WeiboUser { return this.wb_user; }
    public set WeiboUser(value: WeiboUser) { this.wb_user = value; }

    public static Parse = (iuser: IUserBase): User => JsonHelper.FromJson<User>(JsonHelper.ToJSON(iuser), User);

}
