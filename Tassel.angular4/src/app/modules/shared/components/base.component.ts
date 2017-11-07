import { IdentityService } from './../../../services/identity/identity.service';
import { GlobalInjection } from './../../../utils/helpers/global_injector.helper';
import { Router, ActivatedRoute } from '@angular/router';
import { AsyncableServiceBase } from '../../../services/base/service.base';
import { NavigationDelegator } from '../../routers/navigation.extensions';
import { LoggerService } from 'ws-logger';
import { FormatService, AdminService, ServerService } from '../../../services/app.service';
import { RouteErrors, ServerStatus } from '../../../model/app.model';

export class TasselComponentBase extends AsyncableServiceBase {

    protected server: ServerService;
    protected formater: FormatService;
    protected logsrv: LoggerService;

    constructor() {
        super();
        this.server = GlobalInjection.Injector.get(ServerService);
        this.logsrv = GlobalInjection.Injector.get(LoggerService);
        this.formater = GlobalInjection.Injector.get(FormatService);
    }
}

export class TasselNavigationBase extends TasselComponentBase {

    protected navigator: NavigationDelegator;

    public get CurrentUser() { return this.identity.CurrentUser; }

    constructor(
        protected identity: IdentityService,
        protected router: Router) {
        super();
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
