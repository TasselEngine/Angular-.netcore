import { Router } from '@angular/router';
import { TasselAdminCompBase } from './../../../shared/components/base.component';
import { Component, HostBinding, OnInit } from '@angular/core';
import { AdminService, IdentityService } from '../../../../services/app.service';
import { pageShowAnimation } from '../../../../utils/app.utils';
import { User } from '../../../../model/app.model';

@Component({
    selector: 'tassel-admin-dash',
    templateUrl: './dashboard.html',
    animations: [pageShowAnimation],
    styleUrls: [
        './dash.scss'
    ]
})
export class AdminDashboardComponent extends TasselAdminCompBase implements OnInit {

    @HostBinding('@routeAnimation') routeAnimation = true;
    @HostBinding('style.display') display = 'block';

    public get IsWideScreen() { return window.innerWidth > 768; }

    public get RouteLinks() { return this.navigator.RouteLinks; }

    constructor(protected router: Router) {
        super(router);
    }

    ngOnInit(): void {

    }

}
