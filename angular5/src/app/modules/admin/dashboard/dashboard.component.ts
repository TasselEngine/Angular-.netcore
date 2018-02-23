import { Router } from '@angular/router';
import { TasselAdminCompBase } from './../../shared/components/base.component';
import { Component, HostBinding } from '@angular/core';
import { AdminService, IdentityService } from '../../../services/app.service';
import { pageShowAnimation } from '../../../utils/app.utils';

@Component({
    selector: 'tassel-admin-dash',
    templateUrl: './dashboard.html',
    animations: [pageShowAnimation],
    styleUrls: [
        './dash.scss'
    ]
})
export class AdminDashboardComponent extends TasselAdminCompBase {

    @HostBinding('@routeAnimation') routeAnimation = true;
    @HostBinding('style.display') display = 'block';

    public get RouteLinks() { return this.navigator.RouteLinks; }

    constructor(protected router: Router) {
        super(router);
    }

}
