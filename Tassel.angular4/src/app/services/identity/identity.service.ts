import { WeiboUser } from './../../model/models/user/weibo.model';
import { IResponse, ServerStatus } from '../../model/interfaces/response.interface';
import { UserType } from '../../model/models/user/user.contract';
import { User, UnionUser } from './../../model/models/user/user.model';

import { ServerService } from '../server/server.service';
import { HttpAsyncClientBase } from '../base/service.base';
import { JsonHelper, StrictResult } from './../../utils/app.utils';

import { HttpType, IError } from 'ws-format-httprequest';
import { LogType, LoggerService, Logger } from 'ws-logger';
import { Injectable } from '@angular/core';
import { RequestOptions, Http, Response, Headers } from '@angular/http';

@Injectable()
export class IdentityService extends HttpAsyncClientBase<IResponse> {

    private get tokenKey() { return 'tassel_token'; }
    public get Root() { return this.server.ServerApiRoot; }

    private logined = false;
    public get IsLogined(): boolean { return this.logined; }

    private user: UnionUser;
    public get CurrentUser(): UnionUser { return this.user; }

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
            const [succeed, code, error, user] = await this.getDetailsAsync();
            if (!succeed) {
                this.logger.Error(['Fetch user infos failed', 'Server Errors.'], 'BuildUserStateAsync');
                return;
            }
            if (code === ServerStatus.Succeed) {
                this.user = user;
                this.logined = true;
            } else {
                this.logger.Warn(['Fetch user infos bad', 'See the exceptions below.', error.msg], 'BuildUserStateAsync');
            }
        } else {
            this.logger.Debug(['No logined status to be created', 'No logined message cound be found in localStorage.'], 'BuildUserStateAsync');
        }
    }

    public TryLoginAsync = async (userName: string, psd: string, remember = true, then: () => void = () => null) => {
        const [succeed, code, error, [user, token]] = await this.loginAsync(userName, psd);
        if (!succeed) {
            this.logger.Error(['Login failed', 'Server Errors.'], 'TryLoginAsync');
            return;
        }
        if (code === ServerStatus.Succeed) {
            this.user = user;
            await then();
            this.setOptions(token);
            if (!remember) { return; }
            this.setLocalStorage(this.user, token);
        } else {
            this.logger.Warn(['Login not done', 'See the exceptions below.', error.msg], 'TryLoginAsync');
        }
    }

    public TryRegisterAsync = async (userName: string, psd: string, remember = true, then: () => void = () => null) => {
        const [succeed, code, error, [user, token]] = await this.registerAsync(userName, psd);
        if (!succeed) {
            this.logger.Error(['Register failed', 'Server Errors.'], 'TryRegisterAsync');
            return;
        }
        if (code === ServerStatus.Succeed) {
            this.user = user;
            await then();
            this.setOptions(token);
            if (!remember) { return; }
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
            const [succ02, code02, error02, [user, token]] = await this.weiboCheckInAsync(wuid);
            if (!succ02) {
                this.logger.Error(['Fetch Weibo user infos failed', 'Server Errors.'], 'TryWeiboAccessAsync');
                return;
            }
            if (code02 === ServerStatus.Succeed) {
                this.user = user;
                this.setOptions(token);
                this.setLocalStorage(this.user, token);
            } else {
                this.logger.Warn(['Fetch Weibo user infos bad', 'See the exceptions below.', error.msg], 'TryWeiboAccessAsync');
            }
        } else {
            this.logger.Warn(['Fetch Weibo access bad', 'See the exceptions below.', error.msg], 'TryWeiboAccessAsync');
        }
    }

    public LogoutAsync = async (then: () => void = () => null) => {
        if (this.user.UserType === UserType.Weibo) {
            const [succeed, code, error, result] = await this.weiboRevokeAsync(this.user.AccessToken);
            if (!succeed || code !== ServerStatus.Succeed) {
                this.logger.Warn(['Revoke token failed in Weibo', 'see more error below here : ', succeed ? result : error], 'LogoutAsync');
                this.toast.WarnToast('Logout failed', 'Can not revoke from Weibo OAuth2.0');
                return;
            }
        }
        this.user = undefined;
        window.localStorage.setItem(this.tokenKey, '');
        this.logined = false;
        this.toast.InfoMessage('Logout successfully.');
        await this.WaitAndDo(then, 200);
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
            StrictResult.Success<[UnionUser, string]>(
                response.status, [UnionUser.ParseUnion((response.content.details || { user: undefined }).user), response.content.token as string], response.message) :
            StrictResult.Failed<[UnionUser, string]>(error);
    }

    private loginAsync = async (userName: string, psd: string) => {
        const [succeed, error, response] = await this.InvokeAsync(
            `${this.Root}/user/login`, this.formOptions, HttpType.POST, JSON.stringify({ user: userName, psd: psd }));
        this.apiLog([succeed, error, response], 'Try to checkin at server', 'loginAsync');
        return succeed ?
            StrictResult.Success<[UnionUser, string]>(
                response.status, [UnionUser.ParseUnion(response.content.user), response.content.token as string], response.message) :
            StrictResult.Failed<[UnionUser, string]>(error);
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
            StrictResult.Success<[UnionUser, string]>(response.status, [
                UnionUser.ParseUnion((response.content || { user: undefined }).user), response.content.token as string], response.message) :
            StrictResult.Failed<[UnionUser, string]>(error);
    }

    private weiboRevokeAsync = async (access_token: string) => {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/user/weibo_revoke/${access_token}`, this.Options);
        this.apiLog([succeed, error, response], 'Try to revoke current user fron weibo oauth 2.0', 'weiboRevokeAsync');
        return succeed ?
            StrictResult.Success(response.status, response.content as boolean, response.message) :
            StrictResult.Failed<boolean>(error);
    }

    private getDetailsAsync = async () => {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/user`, this.Options);
        this.apiLog([succeed, error, response], 'Try to fetch current user infos', 'getDetailsAsync');
        return succeed ?
            StrictResult.Success<UnionUser>(response.status, UnionUser.ParseUnion((response.content || { user: null }).user)) :
            StrictResult.Failed<UnionUser>(error);
    }

    private getUserDetailsAsync = async (uuid: string) => {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/user/${uuid}`, this.Options);
        this.apiLog([succeed, error, response], 'Try to fetch someone of base user details', 'getUserDetailsAsync');
        return succeed ?
            StrictResult.Success(response.status, UnionUser.Parse(response.content), response.message) :
            StrictResult.Failed<UnionUser>(error);
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
            StrictResult.Success(response.status, UnionUser.Parse(response.content), response.message) :
            StrictResult.Failed<UnionUser>(error);
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
