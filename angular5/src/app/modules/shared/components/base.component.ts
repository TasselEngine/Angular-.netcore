import { IdentityService } from './../../../services/identity/identity.service';
import { GlobalInjection } from './../../../utils/helpers/global_injector.helper';
import { Router, ActivatedRoute } from '@angular/router';
import { AsyncableServiceBase } from '../../../services/base/service.base';
import { LoggerService } from 'ws-logger';
import { FormatService, AdminService, ServerService, CacheService, RouterService, ToastService } from '../../../services/app.service';
import { RouteErrors, ServerStatus } from '../../../model/app.model';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { WSi18N } from '../../i18n/token';
import { I18N } from '../../i18n/i18n.service';

type IObservableHost<T> = Subject<T> | Observable<T>;

export class TasselComponentBase extends AsyncableServiceBase {

    protected readonly server: ServerService;
    protected readonly formater: FormatService;
    protected readonly logsrv: LoggerService;
    protected readonly notify: ToastService;

    private _i18nHandler: I18N;

    private _i18n_locale: any;
    private _i18n_prefix: string;
    public get i18n() { return this._i18n_locale || this._i18nHandler.Locale; }
    public get I18N() { return this._i18nHandler; }

    private subscriptions: Array<[(string | IObservableHost<any>), Subscription]> = [];

    constructor() {
        super();
        this.server = GlobalInjection.Injector.get(ServerService);
        this.logsrv = GlobalInjection.Injector.get(LoggerService);
        this.formater = GlobalInjection.Injector.get(FormatService);
        this.notify = GlobalInjection.Injector.get(ToastService);
        this._i18nHandler = GlobalInjection.Injector.get(I18N);
    }

    protected setI18nPrefix(prefix: string) {
        this._i18n_prefix = prefix;
        this._i18n_locale = this._i18nHandler.Locale[prefix];
    }

    protected translate(input: string, prefix?: string | boolean) {
        const realPre = prefix === false ? null : (!prefix || prefix === true) ? this._i18n_prefix : prefix;
        return this._i18nHandler.Get(input, null, true, true, realPre);
    }

    protected subscribe<T>(observaber: IObservableHost<T> | [IObservableHost<T>, string], subscriber: (arg: T) => void) {
        let key: (string | IObservableHost<T>);
        let obser: IObservableHost<T>;
        if (observaber instanceof Array) {
            [obser, key] = observaber;
        } else {
            obser = key = observaber;
        }
        const newSubp = obser.subscribe(subscriber);
        const subpArray = this.subscriptions.find(([ky, subp]) => ky === key);
        if (subpArray) {
            if (subpArray[1] && !subpArray[1].closed) {
                subpArray[1].unsubscribe();
            }
            subpArray[1] = newSubp;
        } else {
            this.subscriptions.push([key, newSubp]);
        }
    }

    protected unsubscribe<T>(observaber: IObservableHost<T> | string) {
        const target = this.subscriptions.find(([key, subp]) => key === observaber);
        if (target && target[1] && !target[1].closed) {
            target[1].unsubscribe();
        }
    }

    protected dispose() {
        this.subscriptions.forEach(([key, subp]) => {
            if (subp && !subp.closed) {
                subp.unsubscribe();
            }
        });
    }
}

export class TasselNavigationBase extends TasselComponentBase {

    protected readonly navigator: RouterService;
    protected readonly cache: CacheService;
    protected readonly identity: IdentityService;

    public get CurrentUser() { return this.identity.CurrentUser; }

    constructor(protected router: Router) {
        super();
        this.identity = GlobalInjection.Injector.get(IdentityService);
        this.cache = GlobalInjection.Injector.get(CacheService);
        this.navigator = GlobalInjection.Injector.get(RouterService).SetRouter(router);
    }

}

export class TasselAdminCompBase extends TasselNavigationBase {

    protected readonly admin: AdminService;

    protected shouldShow = false;
    public get ShouldShow() { return this.shouldShow; }

    constructor(protected router: Router) {
        super(router);
        this.admin = GlobalInjection.Injector.get(AdminService);
        this.checkRoleAsync();
    }

    private checkRoleAsync = async () => {
        if (this.admin.AccessChecked) {
            this.shouldShow = true;
            return;
        }
        for (let i = 0; i < 100; i++) {
            if (this.identity.StatusInit) { break; }
            await this.Delay(100);
        }
        if (!this.identity.IsLogined) {
            this.navigator.GoToForbidden(RouteErrors.LoginTimeout);
            return;
        }
        const [succeed, code, error, is_admin] = await this.admin.CheckAdminAsync();
        if (!succeed) {
            this.navigator.GoToForbidden(RouteErrors.ServerError);
            return;
        }
        if (code === ServerStatus.UserAccessDenied) {
            this.navigator.GoToForbidden(RouteErrors.AccessDenied);
            return;
        }
        this.shouldShow = true;
        this.admin.CheckAccess(true);
    }

}
