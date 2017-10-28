import { TasselAdminCompBase } from './../../shared/components/base.component';
import { Component, HostBinding } from '@angular/core';
import { AdminService, IdentityService } from '../../../services/app.service';
import { Router } from '@angular/router';
import { pageShowAnimation } from '../../../utils/app.utils';

@Component({
    selector: 'tassel-admin-status',
    templateUrl: './status.html',
    animations: [pageShowAnimation],
    styleUrls: [
        './admin-status.scss'
    ]
})
export class AdminStatusComponent extends TasselAdminCompBase {

    @HostBinding('@routeAnimation') routeAnimation = true;
    @HostBinding('style.display') display = 'block';

    constructor(
        protected admin: AdminService,
        protected identity: IdentityService,
        protected router: Router) {
        super(admin, identity, router);
    }

}