import { User } from './user.model';
import { IServerUserReturn, UserType } from './user.contract';
import { WeiboUser } from './weibo.model';

export class IdentityUtils {

    public static ParseUser = <V>(infos: IServerUserReturn, type?: UserType): [User, V, UserType] => {
        if (!infos) { return [null, null, null]; }
        const user_base = infos.user;
        const more = infos.more;
        const is3rd = user_base.is_third_part || false;
        if (!type) {
            type = !is3rd ? UserType.Base : !more ? UserType.Base :
                more.weibo ? UserType.Weibo : more.wechat ? UserType.Wechat : more.qq ? UserType.QQ : UserType.Base;
        }
        const user_3rd: any = type === UserType.Base ? null :
            type === UserType.Weibo ? WeiboUser.Parse(more.weibo) :
                type === UserType.Wechat ? null : null;
        return [User.Parse(user_base), user_3rd as V, type];
    }

    public static ParseUserFor = <V>(infos: IServerUserReturn, type: UserType): [User, V] => {
        if (!infos) { return [null, null]; }
        const result = IdentityUtils.ParseUser<V>(infos, type);
        return [result[0], result[1]];
    }

    public static PrepareThirdUser = (user: User, more: any) => {
        const is3rd = user.IsThirdPart || false;
        user.UserType = !is3rd ? UserType.Base : !more ? UserType.Base :
            user.WeiboID ? UserType.Weibo : user.WechatID ? UserType.Wechat : user.QQID ? UserType.QQ : UserType.Base;
        if (user.UserType === UserType.Weibo) {
            user.WeiboUser = WeiboUser.Parse(more);
        }
        return user;
    }

}
