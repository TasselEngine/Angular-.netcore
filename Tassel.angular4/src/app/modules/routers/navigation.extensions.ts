import { IdentityService } from './../../services/identity/identity.service';
import { LoggerService, Logger } from 'ws-logger';
import { Router, NavigationExtras } from '@angular/router';

export class NavigationDelegator {

    private readonly index = ['/index'];
    private readonly userRoot = ['/user'];
    private readonly register = [...this.userRoot, 'register'];
    private readonly login = [...this.userRoot, 'login'];

    private readonly profile_patch = 'profile';

    private readonly route_maps = {
        'Home': this.index,
        'Register': this.register,
        'Login': this.login
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

    public readonly GoToCurrentProfile = (uname?: string) => {
        this.routeSafely([...this.userRoot, uname || this.user_name, this.profile_patch]);
    }

}
