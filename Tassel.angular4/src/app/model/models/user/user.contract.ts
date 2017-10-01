
export enum UserType { Base, Weibo, Wechat, QQ }

export interface IServerUserReturn {
    user?: IUserBase;
    more?: {
        weibo?: IWeiboUser;
        wechat?: any;
        qq?: any;
    };
}

export interface IUserBase {
    uuid: string;
    role_id: number;
    user_name: string;
    email: string;
    display_name: string;
    family_name: string;
    given_name: string;
    gender: number;
    birth_date: string;
    create_time: string;
    update_time: string;
    weibo_id: string;
    wechat_token: string;
    qq_token: string;
    avatar: string;
    is_third_part: boolean;
}

export interface IWeiboUser {
    id?: number;
    uid?: string;
    access_token: string;
    screen_name: string;
    description: string;
    domain: string;
    avatar_url: string;
    create_time?: number;
    update_time?: string;
}

export interface IUnionUser {
    IWeiboUser;
    IUserBase;
}
