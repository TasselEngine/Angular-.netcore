import { GlobalInjection } from './../../../utils/helpers/global_injector.helper';
import { Router } from '@angular/router';
import { AsyncableServiceBase } from '../../../services/base/service.base';
import { NavigationDelegator } from '../../routers/navigation.extensions';
import { LoggerService } from 'ws-logger';

export class TasselComponentBase extends AsyncableServiceBase {
    constructor() { super(); }
}

export class TasselNavigationBase extends TasselComponentBase {

    protected navigator: NavigationDelegator;
    protected logsrv: LoggerService;

    constructor(protected router: Router) {
        super();
        this.logsrv = GlobalInjection.Injector.get(LoggerService);
        this.navigator = new NavigationDelegator(router, this.logsrv);
    }

}
