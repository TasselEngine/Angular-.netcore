import { IUserBase, UserType, IUnionUser } from './user.contract';
import { SrvTimeFormat } from './../../interfaces/response.interface';
import { FormatTime } from 'ws-format-time';
import { serializeAs, deserialize, deserializeAs, inheritSerialization } from 'cerialize';
import { JsonHelper } from '../../../utils/app.utils';
import { WeiboUser } from './weibo.model';

export class Creator {

    @serializeAs('uuid')
    @deserializeAs('uuid')
    private uuid: string;
    public get UUID(): string { return this.uuid; }

    @serializeAs('user_name')
    @deserializeAs('user_name')
    private user_name: string;
    public get UserName(): string { return this.user_name; }

    @serializeAs('avatar')
    @deserializeAs('avatar')
    private avatar: string;
    public get Avatar(): string { return this.avatar; }

    constructor(uuid?: string, name?: string, avatar?: string) {
        this.uuid = uuid;
        this.user_name = name;
        this.avatar = avatar;
    }

}

@inheritSerialization(Creator)
export class User extends Creator {

    @serializeAs('role')
    @deserializeAs('role')
    private role_str: string;
    public get Role(): string { return this.role_str; }

    @serializeAs('display_name')
    @deserializeAs('display_name')
    private display_name: string;
    public get DisplayName(): string { return this.display_name; }

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
    @deserializeAs(Number, 'gender')
    private gender: number;
    public get Gender(): boolean { return this.gender === 0; }

    @serializeAs('birth_date')
    @deserializeAs('birth_date')
    private birth_date: string;
    private _birthDate: FormatTime;
    public get BirthDate(): FormatTime {
        return this._birthDate || (this._birthDate = FormatTime.Parse(SrvTimeFormat, this.birth_date, 8));
    }

    @serializeAs('create_time')
    @deserializeAs('create_time')
    private create_time: string;
    private _createTime: FormatTime;
    public get CreateTime(): FormatTime {
        return this._createTime || (this._createTime = FormatTime.Parse(SrvTimeFormat, this.create_time, 8));
    }

    @serializeAs('update_time')
    @deserializeAs('update_time')
    private update_time: string;
    private _updateTime: FormatTime;
    public get UpdateTime(): FormatTime {
        return this._updateTime || (this._updateTime = FormatTime.Parse(SrvTimeFormat, this.update_time, 8));
    }

    @serializeAs('weibo_id')
    @deserializeAs('weibo_id')
    private weibo_id?: string;
    public get WeiboID(): string { return this.weibo_id; }

    @serializeAs('wechat_token')
    @deserializeAs('wechat_token')
    private wechat_token?: string;
    public get WechatID(): string { return this.wechat_token; }

    @serializeAs('qq_token')
    @deserializeAs('qq_token')
    private qq_token?: string;
    public get QQID(): string { return this.qq_token; }

    @serializeAs('is_third_part')
    @deserializeAs('is_third_part')
    private is_3rd: boolean;
    public get IsThirdPart(): boolean { return this.is_3rd; }

    public static Parse = (iuser: IUserBase) => JsonHelper.FromJson<User>(JsonHelper.ToJSON(iuser), User);

    public static ParseList = (iusers: IUserBase[]) => (iusers || []).map(iuser => JsonHelper.FromJson<User>(JsonHelper.ToJSON(iuser), User));

    public ChangeRole(newRole: string) {
        this.role_str = newRole;
        return this;
    }

}

@inheritSerialization(User)
export class UnionUser extends User {

    @serializeAs('user_type')
    @deserializeAs(Number, 'user_type')
    private user_type: UserType = UserType.Base;
    public get UserType(): UserType { return this.user_type; }
    public set UserType(value: UserType) { this.user_type = value; }

    @serializeAs('access_token')
    @deserializeAs('access_token')
    private access_token: string;
    public get AccessToken(): string { return this.access_token; }

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

    public get Photo(): string { return this.user_type !== UserType.Base ? this.avatar_url : this.Avatar; }

    public get FriendlyName(): string {
        return this.user_type !== UserType.Base ? this.screen_name :
            this.DisplayName || this.UserName;
    }

    public static ParseUnion = (iuser: IUnionUser) => JsonHelper.FromJson<UnionUser>(JsonHelper.ToJSON(iuser), UnionUser);

    constructor() { super(); }

}
