import { IdentityService } from './../../../services/identity/identity.service';
import { GlobalInjection } from './../../../utils/helpers/global_injector.helper';
import { Router } from '@angular/router';
import { AsyncableServiceBase } from '../../../services/base/service.base';
import { NavigationDelegator } from '../../routers/navigation.extensions';
import { LoggerService } from 'ws-logger';
import { FormatService } from '../../../services/app.service';

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
