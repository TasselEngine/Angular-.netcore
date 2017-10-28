import { IdentityService } from './../../services/identity/identity.service';
import { LoggerService, Logger } from 'ws-logger';
import { Router, NavigationExtras } from '@angular/router';
import { RouteErrors } from '../../model/app.model';

export class NavigationDelegator {

    private readonly profile_patch = 'profile';
    private readonly details_patch = 'details';
    private readonly dashboard_patch = 'dashboard';
    private readonly status_patch = 'status';
    private readonly notfound_patch = '404';
    private readonly forbidden_patch = '401';

    private readonly index = ['/index'];
    private readonly userRoot = ['/user'];
    private readonly statusRoot = ['/status'];
    private readonly errorsRoot = ['/errors'];
    private readonly adminRoot = ['/admin'];

    private readonly register = [...this.userRoot, 'register'];
    private readonly login = [...this.userRoot, 'login'];
    private readonly error401 = [...this.errorsRoot, this.forbidden_patch];
    private readonly error404 = [...this.errorsRoot, this.notfound_patch];
    private readonly adminDashboard = [...this.adminRoot, this.dashboard_patch];
    private readonly adminStatus = [...this.adminRoot, this.status_patch];

    private readonly route_maps = {
        'Home': this.index,
        'NotFound': this.error404,
        'Forbidden': this.error401,
        'Register': this.register,
        'Login': this.login,
        'Status': this.statusRoot,
        'AdminDashboard': this.adminDashboard,
        'AdminStatus': this.adminStatus,
    };
    public get RouteLinks() {
        return this.route_maps;
    }

    private get user_name() { return (this.identity.CurrentUser || { UserName: 'unknown' }).UserName; }

    private logger: Logger<NavigationDelegator>;

    constructor(
        private identity: IdentityService,
        private router: Router,
        private logsrv: LoggerService) {
        this.logger = this.logsrv.GetLogger(NavigationDelegator);
    }

    private routeSafely = (commands: any[], navigate_extra?: NavigationExtras) => {
        try {
            this.router.navigate(commands, navigate_extra);
        } catch (error) {
            this.logger.Error(['Navigation failed', 'see more infomations below here.', error], 'routeSafely');
        }
    }

    public readonly GoHome = () => {
        this.routeSafely(this.index);
    }

    public readonly GoToRegister = () => {
        this.routeSafely(this.register);
    }

    public readonly GoToLogin = () => {
        this.routeSafely(this.login);
    }

    public readonly GoToNotFound = (flag: RouteErrors = RouteErrors.NotFound) => {
        this.routeSafely(this.error404, { queryParams: { type: flag } });
    }

    public readonly GoToForbidden = (flag: RouteErrors = RouteErrors.Forbidden) => {
        this.routeSafely(this.error401, { queryParams: { type: flag } });
    }

    public readonly GoToCurrentProfile = (uname?: string) => {
        this.routeSafely([...this.userRoot, uname || this.user_name, this.profile_patch]);
    }

    public readonly GoToStatusIndex = () => {
        this.routeSafely(this.statusRoot);
    }

    public readonly GoToStatusDetails = (statusid: string) => {
        this.routeSafely([...this.statusRoot, statusid, this.details_patch]);
    }

    public readonly GoToAdminStatus = () => {
        this.routeSafely(this.adminStatus);
    }

    public readonly GoToAdminDashboard = () => {
        this.routeSafely(this.adminDashboard);
    }

}
