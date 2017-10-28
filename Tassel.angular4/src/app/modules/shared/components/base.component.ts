import { IdentityService } from './../../../services/identity/identity.service';
import { GlobalInjection } from './../../../utils/helpers/global_injector.helper';
import { Router, ActivatedRoute } from '@angular/router';
import { AsyncableServiceBase } from '../../../services/base/service.base';
import { NavigationDelegator } from '../../routers/navigation.extensions';
import { LoggerService } from 'ws-logger';
import { FormatService, AdminService } from '../../../services/app.service';
import { RouteErrors, ServerStatus } from '../../../model/app.model';

export class TasselComponentBase extends AsyncableServiceBase {
    constructor() { super(); }
}

export class TasselNavigationBase extends TasselComponentBase {

    protected navigator: NavigationDelegator;
    protected formater: FormatService;
    protected logsrv: LoggerService;

    constructor(
        protected identity: IdentityService,
        protected router: Router) {
        super();
        this.logsrv = GlobalInjection.Injector.get(LoggerService);
        this.formater = GlobalInjection.Injector.get(FormatService);
        this.navigator = new NavigationDelegator(identity, router, this.logsrv);
    }

}

export class TasselAdminCompBase extends TasselNavigationBase {

    protected shouldShow = false;
    public get ShouldShow() { return this.shouldShow; }

    constructor(
        protected admin: AdminService,
        protected identity: IdentityService,
        protected router: Router) {
        super(identity, router);
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
            this.navigator.GoToForbidden(RouteErrors.NotLogin);
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
