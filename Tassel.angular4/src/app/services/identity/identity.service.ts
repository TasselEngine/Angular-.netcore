import { WeiboUser } from './../../model/models/user/weibo.model';
import { IResponse, ServerStatus } from '../../model/interfaces/response.interface';
import { UserType } from '../../model/models/user/user.contract';
import { User } from './../../model/models/user/user.model';

import { ServerService } from '../server/server.service';
import { HttpAsyncClientBase } from '../base/service.base';
import { JsonHelper, StrictResult } from './../../utils/app.utils';

import { HttpType, IError } from 'ws-format-httprequest';
import { LogType, LoggerService, Logger } from 'ws-logger';
import { Injectable } from '@angular/core';
import { RequestOptions, Http, Response, Headers } from '@angular/http';
import { IdentityUtils } from '../../model/models/user/identity.model';

@Injectable()
export class IdentityService extends HttpAsyncClientBase<IResponse> {

    private get tokenKey() { return 'tassel_token'; }
    public get Root() { return this.server.ServerApiRoot; }

    private logined = false;
    public get IsLogined(): boolean { return this.logined; }

    private user: User;
    public get CurrentUser(): User { return this.user; }

    private formOptions: RequestOptions;
    public get FormOptions() { return this.formOptions; }

    private options: RequestOptions;
    public get Options() { return this.options; }

    private token: string;
    public get Token() { return this.token; }

    private logger: Logger<IdentityService>;

    constructor(
        protected http: Http,
        private server: ServerService) {
        super(http);
        this.logger = this.logsrv.GetLogger(IdentityService).SetModule('service');
        this.options = new RequestOptions();
        this.formOptions = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) });
        this.BuildUserStateAsync();
    }

    /**
     * Try to build user status by token which is exist in the localStorage, action will be ignored   if not find the token.
     *
     * @memberof IdentityService
     */
    public BuildUserStateAsync = async () => {
        const tklocal = window.localStorage.getItem(this.tokenKey);
        if (tklocal) {
            this.logger.Debug(['Try to build user status by token exist', 'The token is read form localStorage.'], 'BuildUserStateAsync');
            this.setOptions(tklocal, false);
            const [succeed, code, error, [user, vuser]] = await this.getDetailsAsync();
            if (!succeed) {
                this.logger.Error(['Fetch user infos failed', 'Server Errors.'], 'BuildUserStateAsync');
                return;
            }
            if (code === ServerStatus.Succeed) {
                this.user = IdentityUtils.PrepareThirdUser(user, vuser);
                this.logined = true;
            } else {
                this.logger.Warn(['Fetch user infos bad', 'See the exceptions below.', error.msg], 'BuildUserStateAsync');
            }
        } else {
            this.logger.Debug(['No logined status to be created', 'No logined message cound be found in localStorage.'], 'BuildUserStateAsync');
        }
    }

    public TryLoginAsync = async (userName: string, psd: string) => {
        const [succeed, code, error, [user, token]] = await this.loginAsync(userName, psd);
        if (!succeed) {
            this.logger.Error(['Login failed', 'Server Errors.'], 'TryLoginAsync');
            return;
        }
        if (code === ServerStatus.Succeed) {
            this.user = user;
            this.setOptions(token);
            this.setLocalStorage(this.user, token);
        } else {
            this.logger.Warn(['Login not done', 'See the exceptions below.', error.msg], 'TryLoginAsync');
        }
    }

    public TryRegisterAsync = async (userName: string, psd: string) => {
        const [succeed, code, error, [user, token]] = await this.registerAsync(userName, psd);
        if (!succeed) {
            this.logger.Error(['Register failed', 'Server Errors.'], 'TryRegisterAsync');
            return;
        }
        if (code === ServerStatus.Succeed) {
            this.user = user;
            this.setOptions(token);
            this.setLocalStorage(this.user, token);
        } else {
            this.logger.Warn(['Register not done', 'See the exceptions below.', error.msg], 'TryRegisterAsync');
        }
    }

    public TryWeiboAccessAsync = async (weibo_code: string, redirect_url: string) => {
        const [succeed, code, error, wuid] = await this.weiboAccessAsync(weibo_code, redirect_url);
        if (!succeed) {
            this.logger.Error(['Fetch Weibo access failed', 'Server Errors.'], 'TryWeiboAccessAsync');
            return;
        }
        if (code === ServerStatus.Succeed) {
            const [succ02, code02, error02, [[user, wuser], token]] = await this.weiboCheckInAsync(wuid);
            if (!succ02) {
                this.logger.Error(['Fetch Weibo user infos failed', 'Server Errors.'], 'TryWeiboAccessAsync');
                return;
            }
            if (code02 === ServerStatus.Succeed) {
                this.user = user;
                this.user.UserType = UserType.Weibo;
                this.user.WeiboUser = wuser;
                this.setOptions(token);
                this.setLocalStorage(this.user, token);
            } else {
                this.logger.Warn(['Fetch Weibo user infos bad', 'See the exceptions below.', error.msg], 'TryWeiboAccessAsync');
            }
        } else {
            this.logger.Warn(['Fetch Weibo access bad', 'See the exceptions below.', error.msg], 'TryWeiboAccessAsync');
        }
    }

    public Logout = () => {
        this.user = undefined;
        window.localStorage.setItem(this.tokenKey, '');
        this.logined = false;
        this.toast.InfoMessage('Logout successfully.');
    }

    private setOptions = (token: string, setStatus = true): void => {
        this.logined = setStatus ? true : this.logined;
        this.token = token;
        this.logger.Debug(['Set options for server', 'Authorization Bearer is need if your are logined.'], 'setOptions');
        const headers = new Headers({ 'Authorization': 'Bearer ' + token });
        this.options = new RequestOptions({ headers: headers });
        this.formOptions = new RequestOptions({
            headers: new Headers({
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            })
        });
    }

    private setLocalStorage = (user: User, token: string): void => {
        window.localStorage.setItem(this.tokenKey, token);
    }

    private registerAsync = async (userName: string, psd: string) => {
        const [succeed, error, response] = await this.InvokeAsync(
            `${this.Root}/user/register`, this.formOptions, HttpType.POST, JSON.stringify({ user: userName, psd: psd }));
        this.apiLog([succeed, error, response], 'Try to register', 'registerAsync');
        return succeed ?
            StrictResult.Success<[User, string]>(
                response.status, [User.Parse((response.content.details || { user: undefined }).user), response.content.token as string], response.message) :
            StrictResult.Failed<[User, string]>(error);
    }

    private loginAsync = async (userName: string, psd: string) => {
        const [succeed, error, response] = await this.InvokeAsync(
            `${this.Root}/user/login`, this.formOptions, HttpType.POST, JSON.stringify({ user: userName, psd: psd }));
        this.apiLog([succeed, error, response], 'Try to checkin at server', 'loginAsync');
        return succeed ?
            StrictResult.Success<[User, string]>(
                response.status, [User.Parse((response.content.details || { user: undefined }).user), response.content.token as string], response.message) :
            StrictResult.Failed<[User, string]>(error);
    }

    private weiboAccessAsync = async (code: string, redirect_url: string) => {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/user/weibo_access?code=${code}&redirect_url=${redirect_url}`, this.options);
        this.apiLog([succeed, error, response], 'Try to fetch Weibo access token', 'weiboAccessAsync');
        return succeed ?
            StrictResult.Success(response.status, (response.content || { wuid: undefined }).wuid as string, response.message) :
            StrictResult.Failed<string>(error);
    }

    private weiboCheckInAsync = async (wuid: string) => {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/user/weibo_checkin`, this.formOptions, HttpType.POST, JSON.stringify({ wuid: wuid }));
        this.apiLog([succeed, error, response], 'Try to checkin at server by Weibo', 'weiboCheckInAsync');
        return succeed ?
            StrictResult.Success<[[User, WeiboUser], string]>(response.status, [
                IdentityUtils.ParseUserFor<WeiboUser>((response.content || { details: null }).details, UserType.Weibo),
                response.content.token as string
            ], response.message) :
            StrictResult.Failed<[[User, WeiboUser], string]>(error);
    }

    private getDetailsAsync = async () => {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/user`, this.Options);
        this.apiLog([succeed, error, response], 'Try to fetch current user infos', 'getDetailsAsync');
        return succeed ?
            StrictResult.Success<[User, any]>(response.status, [
                User.Parse((response.content || { user: null }).user), (response.content || { more: null }).more], response.message) :
            StrictResult.Failed<[User, any]>(error);
    }

    private getUserDetailsAsync = async (uuid: string) => {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/user/${uuid}`, this.Options);
        this.apiLog([succeed, error, response], 'Try to fetch someone of base user details', 'getUserDetailsAsync');
        return succeed ?
            StrictResult.Success(response.status, User.Parse(response.content), response.message) :
            StrictResult.Failed<User>(error);
    }

    private getWeiboDetailsAsync = async (uid: string) => {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/user/weibo_details/${uid}`, this.Options);
        this.apiLog([succeed, error, response], 'Try to fetch someone who checkined by Weibo', 'getWeiboDetailsAsync');
        return succeed ?
            StrictResult.Success(response.status, WeiboUser.Parse(response.content), response.message) :
            StrictResult.Failed<WeiboUser>(error);
    }

    private getAllUsersAsync = async () => {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/user/all`, this.Options);
        this.apiLog([succeed, error, response], 'Try to fetch user-list', 'getAllUsersAsync');
        return succeed ?
            StrictResult.Success(response.status, User.Parse(response.content), response.message) :
            StrictResult.Failed<User>(error);
    }

    private apiLog = (result: [boolean, IError, IResponse], title: string, method: string, descrip?: string) => {
        const [succeed, error, response] = result;
        if (succeed) {
            this.logger.Debug([`[ API ]${title}`, ...(descrip ? [descrip, response] : [response])], method);
        } else {
            this.logger.Error([`[ API ]${title}`, 'Connect To Server Failed.', error], method);
        }
    }

}
