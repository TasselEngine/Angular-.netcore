import { PipeTransform, Pipe } from '@angular/core';
import { User } from '../../../../model/app.model';

@Pipe({ name: 'adminUserDisplay' })
export class AdminUserNameDisplayPipe implements PipeTransform {
    transform(user: User) {
        if (!user) { return ''; }
        if (user.IsThirdPart) {
            if (user.WeiboID) { return 'WeiboUser-' + user.WeiboID; }
            if (user.WechatID) { return 'WeChatUser-' + user.WechatID; }
            if (user.QQID) { return 'QQUser-' + user.QQID; }
        }
        return user.UserName;
    }

}
