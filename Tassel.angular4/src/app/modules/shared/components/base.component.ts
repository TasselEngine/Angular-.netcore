import { Router } from '@angular/router';
import { AsyncableServiceBase } from '../../../services/base/service.base';
import { NavigationDelegator } from '../../../utils/app.utils';

export class TasselComponentBase extends AsyncableServiceBase {
    constructor() { super(); }
}

export class TasselNavigationBase extends TasselComponentBase {

    protected navigator: NavigationDelegator;

    constructor(protected router: Router) {
        super();
        this.navigator = new NavigationDelegator(router);
    }

}
