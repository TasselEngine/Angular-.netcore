
export enum UserType { Base, Weibo, Wechat, QQ }

export interface ICreator {
    uuid: string;
    user_name: string;
}

export interface IUserBase {
    ICreator;
    role: string;
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
