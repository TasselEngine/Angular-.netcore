import { IdentityService } from './../../../services/identity/identity.service';
import { GlobalInjection } from './../../../utils/helpers/global_injector.helper';
import { Router, ActivatedRoute } from '@angular/router';
import { AsyncableServiceBase } from '../../../services/base/service.base';
import { LoggerService } from 'ws-logger';
import { FormatService, AdminService, ServerService, CacheService, RouterService } from '../../../services/app.service';
import { RouteErrors, ServerStatus } from '../../../model/app.model';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

type IObservableHost = Subject<any> | Observable<any>;

export class TasselComponentBase extends AsyncableServiceBase {

    protected server: ServerService;
    protected formater: FormatService;
    protected logsrv: LoggerService;

    private subscriptions: Array<[(string | IObservableHost), Subscription]> = [];

    constructor() {
        super();
        this.server = GlobalInjection.Injector.get(ServerService);
        this.logsrv = GlobalInjection.Injector.get(LoggerService);
        this.formater = GlobalInjection.Injector.get(FormatService);
    }

    protected subscribe(observaber: IObservableHost | [IObservableHost, string], subscriber: (...args: any[]) => void) {
        let key: (string | IObservableHost);
        let obser: IObservableHost;
        if (observaber instanceof Array) {
            [obser, key] = observaber;
        } else {
            key = observaber;
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

    protected unsubscribe(observaber: IObservableHost | string) {
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

    protected navigator: RouterService;
    protected cache: CacheService;
    protected identity: IdentityService;

    public get CurrentUser() { return this.identity.CurrentUser; }

    constructor(protected router: Router) {
        super();
        this.identity = GlobalInjection.Injector.get(IdentityService);
        this.cache = GlobalInjection.Injector.get(CacheService);
        this.navigator = GlobalInjection.Injector.get(RouterService).SetRouter(router);
    }

}

export class TasselAdminCompBase extends TasselNavigationBase {

    protected admin: AdminService;

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
