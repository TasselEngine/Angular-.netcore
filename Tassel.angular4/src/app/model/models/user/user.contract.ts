
export enum UserType { Base, Weibo, Wechat, QQ }

export interface IUserBase {
    uuid: string;
    role_id: number;
    user_name: string;
    email: string;
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
}

export interface IWeiboUser {
    id: number;
    uid: string;
    screen_name: string;
    description: string;
    domain: string;
    avatar_url: string;
    create_time: number;
    update_time: string;
}
