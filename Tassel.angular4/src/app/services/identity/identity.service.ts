import { WeiboUser } from './../../model/models/user/weibo.model';
import { StrictResult } from './../../utils/helpers/strict_result.helper';
import { JsonHelper } from './../../utils/app.utils';
import { User } from './../../model/models/user/user.model';
import { HttpType, IError } from 'ws-format-httprequest';
import { LogType, LoggerService, Logger } from 'ws-logger';
import { Injectable } from '@angular/core';
import { RequestOptions, Http, Response, Headers } from '@angular/http';
import { IResponse } from '../../model/interfaces/response.interface';
import { ServerService } from '../server/server.service';
import { HttpAsyncClientBase } from '../base/service.base';
import { UserType } from '../../model/models/user/user.contract';

@Injectable()
export class IdentityService extends HttpAsyncClientBase<IResponse> {

    public get Root() { return this.server.ServerApiRoot; }

    private user: User;
    public get CurrentUser(): User { return this.user; }

    private formOptions: RequestOptions;
    public get FormOptions() { return this.formOptions; }

    private options: RequestOptions;
    public get Options() { return this.options; }

    private logger: Logger<IdentityService>;

    constructor(
        protected http: Http,
        private server: ServerService) {
        super(http);
        this.logger = this.logsrv.GetLogger(IdentityService).SetModule('service');
        this.options = new RequestOptions();
        this.formOptions = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) });
    }

    public TryLoginAsync = async (userName: string, psd: string) => {
        const [succeed, code, error, [user, token]] = await this.loginAsync(userName, psd);
        if (!succeed) {
            this.logger.Error(['登陆失败', '服务器错误'], 'LoginAsync');
            return;
        }
        if (code === 0) {
            this.user = user;
            this.setOptions(token);
        } else {
            this.logger.Error(['登陆没能成功', '请参考错误信息', error.msg], 'LoginAsync');
        }
    }

    public TryRegisterAsync = async (userName: string, psd: string) => {
        const [succeed, code, error, [user, token]] = await this.registerAsync(userName, psd);
        if (!succeed) {
            this.logger.Error(['注册失败', '服务器错误'], 'RegisterAsync');
            return;
        }
        if (code === 0) {
            this.user = user;
            this.setOptions(token);
        } else {
            this.logger.Error(['注册未能成功', '请参考错误信息', error.msg], 'RegisterAsync');
        }
    }

    public TryWeiboAccessAsync = async (weibo_code: string, redirect_url: string) => {
        const [succeed, code, error, wuid] = await this.weiboAccessAsync(weibo_code, redirect_url);
        if (!succeed) {
            this.logger.Error(['获取微博权限失败', '服务器错误'], 'TryWeiboAccessAsync');
            return;
        }
        if (code === 0) {
            const [succ02, code02, error02, [user, wuser, token]] = await this.weiboCheckInAsync(wuid);
            if (!succ02) {
                this.logger.Error(['获取微博用户信息失败', '服务器错误'], 'TryWeiboAccessAsync');
                return;
            }
            if (code02 === 0) {
                this.user = user;
                this.user.UserType = UserType.Weibo;
                this.user.WeiboUser = wuser;
                this.setOptions(token);
            } else {
                this.logger.Error(['获取微博用户信息发生异常', '请参考错误信息', error.message], 'TryWeiboAccessAsync');
            }
        } else {
            this.logger.Error(['获取微博用户权限发生异常', '请参考错误信息', error.message], 'TryWeiboAccessAsync');
        }
    }

    private setOptions = (token: string): void => {
        const headers = new Headers({ 'Authorization': 'Bearer ' + token });
        this.options = new RequestOptions({ headers: headers });
        this.formOptions = new RequestOptions({
            headers: new Headers({
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            })
        });
    }

    private registerAsync = async (userName: string, psd: string) => {
        const [succeed, error, response] = await this.InvokeAsync(
            `${this.Root}/user/register`, this.formOptions, HttpType.POST, JSON.stringify({ user: userName, psd: psd }));
        this.apiLog([succeed, error, response], '尝试在服务器注册', 'registerAsync');
        return succeed ?
            StrictResult.Success<[User, string]>(
                response.status, [User.Parse((response.content.details || { user: undefined }).user), response.content.token as string], response.message) :
            StrictResult.Failed<[User, string]>(error);
    }

    private loginAsync = async (userName: string, psd: string) => {
        const [succeed, error, response] = await this.InvokeAsync(
            `${this.Root}/user/login`, this.formOptions, HttpType.POST, JSON.stringify({ user: userName, psd: psd }));
        this.apiLog([succeed, error, response], '尝试登录到服务器', 'loginAsync');
        return succeed ?
            StrictResult.Success<[User, string]>(
                response.status, [User.Parse((response.content.details || { user: undefined }).user), response.content.token as string], response.message) :
            StrictResult.Failed<[User, string]>(error);
    }

    private weiboAccessAsync = async (code: string, redirect_url: string) => {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/user/weibo_access?code=${code}&redirect_url=${redirect_url}`, this.options);
        this.apiLog([succeed, error, response], '尝试获取微博权限', 'weiboAccessAsync');
        return succeed ?
            StrictResult.Success(response.status, response.content.wuid as string, response.message) :
            StrictResult.Failed<string>(error);
    }

    private weiboCheckInAsync = async (wuid: string) => {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/user/weibo_checkin`, this.formOptions, HttpType.POST, JSON.stringify({ wuid: wuid }));
        this.apiLog([succeed, error, response], '尝试使用微博登记', 'weiboCheckInAsync');
        return succeed ?
            StrictResult.Success<[User, WeiboUser, string]>(
                response.status, [
                    User.Parse((response.content.details || { user: undefined }).user),
                    WeiboUser.Parse((response.content.details.more || { weibo: undefined }).weibo),
                    response.content.token as string
                ], response.message) :
            StrictResult.Failed<[User, WeiboUser, string]>(error);
    }

    private getAllUsersAsync = async () => {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/user`, this.Options);
        this.apiLog([succeed, error, response], '尝试获取用户列表', 'getAllUsersAsync');
        return succeed ?
            StrictResult.Success(response.status, User.Parse(response.content), response.message) :
            StrictResult.Failed<User>(error);
    }

    private getUserDetailsAsync = async (uuid?: string) => {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/user/${uuid || this.user.UUID}`, this.Options);
        this.apiLog([succeed, error, response], '尝试获取用户详细信息', 'getUserDetailsAsync');
        return succeed ?
            StrictResult.Success(response.status, User.Parse(response.content), response.message) :
            StrictResult.Failed<User>(error);
    }

    private apiLog = (result: [boolean, IError, IResponse], title: string, method: string, descrip?: string) => {
        const [succeed, error, response] = result;
        if (succeed) {
            this.logger.Debug([`[ API ]${title}`, ...(descrip ? [descrip, response] : [response])], method);
        } else {
            this.logger.Error([`[ API ]${title}`, '与服务器的连接异常', error], method);
        }
    }

}
