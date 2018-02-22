import { ServerService } from '../server/server.service';
import { HttpAsyncClientBase } from '../base/service.base';
import { JsonHelper, StrictResult } from './../../utils/app.utils';

import { HttpType, IError, IRequestOptions } from 'ws-format-httprequest';
import { LogType, LoggerService, Logger } from 'ws-logger';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { IResponse, UnionUser, ServerStatus, UserType, User, WeiboUser } from '../../model/app.model';

@Injectable()
export class IdentityService extends HttpAsyncClientBase<IResponse> {

    private get tokenKey() { return 'tassel_token'; }
    public get Root() { return this.server.ServerApiRoot; }

    private isInit = false;
    public get StatusInit(): boolean { return this.isInit; }

    private logined = false;
    public get IsLogined(): boolean { return this.logined; }

    private user: UnionUser;
    public get CurrentUser(): UnionUser { return this.user; }

    public get CurrentUUID(): string { return (this.user || { UUID: undefined }).UUID; }

    private formOptions: IRequestOptions;
    public get FormOptions() { return createNewObject(this.formOptions); }

    private options: IRequestOptions;
    public get Options() { return createNewObject(this.options); }

    private token: string;
    public get Token() { return this.token; }

    private logger: Logger<IdentityService>;

    constructor(
        protected http: HttpClient,
        private server: ServerService) {
        super(http);
        this.logger = this.logsrv.GetLogger(IdentityService).SetModule('service');
        this.options = {};
        this.formOptions = { headers: { 'Content-Type': 'application/json' } };
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
                this.toast.ErrorToast('Fetch user infos failed', 'Server error');
                this.isInit = true;
                return;
            }
            if (code === ServerStatus.Succeed) {
                this.user = user;
                this.logined = true;
                this.isInit = true;
            } else {
                this.isInit = true;
                this.logger.Warn(['Fetch user infos bad', 'See the exceptions below.', error.msg], 'BuildUserStateAsync');
                this.toast.WarnToast('Fetch user infos failed', error.msg);
            }
        } else {
            this.isInit = true;
            this.logger.Debug(['No logined status to be created', 'No logined msg cound be found in localStorage.'], 'BuildUserStateAsync');
        }
    }

    public TryLoginAsync = async (userName: string, psd: string, remember = true, then: () => void = () => null) => {
        const [succeed, code, error, [user, token]] = await this.loginAsync(userName, psd);
        if (!succeed) {
            this.logger.Error(['Login failed', 'Server Errors.'], 'TryLoginAsync');
            this.toast.ErrorToast('Login failed', 'Server error');
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
            this.toast.WarnToast('Login failed', error.msg);
        }
    }

    public TryRegisterAsync = async (userName: string, psd: string, remember = true, then: () => void = () => null) => {
        const [succeed, code, error, [user, token]] = await this.registerAsync(userName, psd);
        if (!succeed) {
            this.logger.Error(['Register failed', 'Server Errors.'], 'TryRegisterAsync');
            this.toast.ErrorToast('Register failed', 'Server error');
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
            this.toast.WarnToast('Register failed', error.msg);
        }
    }

    public TryWeiboAccessAsync = async (weibo_code: string, redirect_url: string) => {
        const [succeed, code, error, wuid] = await this.weiboAccessAsync(weibo_code, redirect_url);
        if (!succeed) {
            this.logger.Error(['Fetch Weibo access failed', 'Server Errors.'], 'TryWeiboAccessAsync');
            this.toast.ErrorToast('Fetch Weibo access failed', 'Server error');
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
                this.toast.WarnToast('Fetch Weibo access failed', error.msg);
            }
        } else {
            this.logger.Warn(['Fetch Weibo access bad', 'See the exceptions below.', error.msg], 'TryWeiboAccessAsync');
            this.toast.WarnToast('Fetch Weibo access failed', error.msg);
        }
    }

    public LogoutAsync = async (then: () => void = () => null) => {
        if (this.user.UserType === UserType.Weibo) {
            const [succeed, code, error, result] = await this.weiboRevokeAsync(this.user.AccessToken);
            if (!succeed || code !== ServerStatus.Succeed) {
                if (result.error_code !== 21317) { // token js rejected. logout safely.
                    this.logger.Warn(['Revoke token failed in Weibo', 'see more error below here : ', succeed ? result : error], 'LogoutAsync');
                    this.toast.WarnToast('Logout failed', 'Can not revoke from Weibo OAuth2.0');
                    return;
                }
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
        this.options = { headers: { 'Authorization': 'Bearer ' + token } };
        this.formOptions = {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        };
    }

    private setLocalStorage = (user: User, token: string): void => {
        window.localStorage.setItem(this.tokenKey, token);
    }

    private registerAsync = async (userName: string, psd: string) => {
        const [succeed, error, response] = await this.InvokeAsync(
            `${this.Root}/user/register`, this.FormOptions, HttpType.POST, JSON.stringify({ user: userName, psd: psd }));
        this.apiLog([succeed, error, response], 'Try to register', 'registerAsync');
        return succeed ?
            StrictResult.Success<[UnionUser, string]>(
                response.status, [UnionUser.ParseUnion(response.content.user), response.content.token as string], response.msg) :
            StrictResult.Failed<[UnionUser, string]>(error);
    }

    private loginAsync = async (userName: string, psd: string) => {
        const [succeed, error, response] = await this.InvokeAsync(
            `${this.Root}/user/login`, this.FormOptions, HttpType.POST, JSON.stringify({ user: userName, psd: psd }));
        this.apiLog([succeed, error, response], 'Try to checkin at server', 'loginAsync');
        return succeed ?
            StrictResult.Success<[UnionUser, string]>(
                response.status, [UnionUser.ParseUnion(response.content.user), response.content.token as string], response.msg) :
            StrictResult.Failed<[UnionUser, string]>(error);
    }

    private weiboAccessAsync = async (code: string, redirect_url: string) => {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/user/weibo_access?code=${code}&redirect_url=${redirect_url}`, this.options);
        this.apiLog([succeed, error, response], 'Try to fetch Weibo access token', 'weiboAccessAsync');
        return succeed ?
            StrictResult.Success(response.status, (response.content || { wuid: undefined }).wuid as string, response.msg) :
            StrictResult.Failed<string>(error);
    }

    private weiboCheckInAsync = async (wuid: string) => {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/user/weibo_checkin`, this.FormOptions, HttpType.POST, JSON.stringify({ wuid: wuid }));
        this.apiLog([succeed, error, response], 'Try to checkin at server by Weibo', 'weiboCheckInAsync');
        return succeed ?
            StrictResult.Success<[UnionUser, string]>(response.status, [
                UnionUser.ParseUnion((response.content || { user: undefined }).user), response.content.token as string], response.msg) :
            StrictResult.Failed<[UnionUser, string]>(error);
    }

    private weiboRevokeAsync = async (access_token: string) => {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/user/weibo_revoke/${access_token}`, this.Options);
        this.apiLog([succeed, error, response], 'Try to revoke current user fron weibo oauth 2.0', 'weiboRevokeAsync');
        return succeed ?
            StrictResult.Success(response.status, response.content as any, response.msg) :
            StrictResult.Failed<any>(error);
    }

    private getDetailsAsync = async () => {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/user`, this.Options);
        this.apiLog([succeed, error, response], 'Try to fetch current user infos', 'getDetailsAsync');
        return succeed ?
            StrictResult.Success<UnionUser>(response.status, UnionUser.ParseUnion(response.content), response.msg) :
            StrictResult.Failed<UnionUser>(error);
    }

    public CheckUserName = (uname: string) => {
        return this.http.get<IResponse>(`${this.Root}/user/check/${uname}`, this.Options);
    }

    public CheckUserNameAsync = async (uname: string) => {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/user/check/${uname}`, this.Options);
        this.apiLog([succeed, error, response], 'Try to check the name of user if not exist', 'CheckUserNameAsync');
        return succeed ?
            StrictResult.Success(response.status, null as any, response.msg) :
            StrictResult.Failed<any>(error);
    }

    public GetUserDetailsAsync = async (uuid: string) => {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/user/${uuid}`, this.Options);
        this.apiLog([succeed, error, response], 'Try to fetch someone of base user details', 'GetUserDetailsAsync');
        return succeed ?
            StrictResult.Success<UnionUser>(response.status, UnionUser.ParseUnion(response.content), response.msg) :
            StrictResult.Failed<UnionUser>(error);
    }

    public GetWeiboDetailsAsync = async (uid: string) => {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/user/weibo_details/${uid}`, this.Options);
        this.apiLog([succeed, error, response], 'Try to fetch someone who checkined by Weibo', 'GetWeiboDetailsAsync');
        return succeed ?
            StrictResult.Success(response.status, WeiboUser.Parse(response.content), response.msg) :
            StrictResult.Failed<WeiboUser>(error);
    }

    public GetAllUsersAsync = async () => {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/user/all`, this.Options);
        this.apiLog([succeed, error, response], 'Try to fetch user-list', 'GetAllUsersAsync');
        return succeed ?
            StrictResult.Success(response.status, UnionUser.Parse(response.content), response.msg) :
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

function createNewObject<T>(param: T) {
    const newOne: T = {} as T;
    for (const propName in param) {
        if (propName) { newOne[propName as string] = param[propName]; }
    }
    return newOne;
}
