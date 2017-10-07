import { LoggerService, Logger } from 'ws-logger';
import { Router, NavigationExtras } from '@angular/router';

export class NavigationDelegator {

    private readonly index = ['/index'];
    private readonly userRoot = ['/user'];
    private readonly register = [...this.userRoot, 'register'];
    private readonly login = [...this.userRoot, 'login'];

    private readonly route_maps = {
        'Home': this.index,
        'Register': this.register,
        'Login': this.login
    };
    public get RouteLinks() {
        return this.route_maps;
    }

    private logger: Logger<NavigationDelegator>;

    constructor(
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
        this.routeSafely(this.index);
    }

    public readonly GoToLoginPage = () => {
        this.routeSafely(this.index);
    }

}
