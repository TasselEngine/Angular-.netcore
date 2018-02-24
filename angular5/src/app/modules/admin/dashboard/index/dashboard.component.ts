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

    private users: User[];
    private admins: User[];
    private cores: User[];

    public get AdminUsers() { return this.admins || []; }
    public get CoreUsers() { return this.cores || []; }
    public get CommonUsers() { return this.users || []; }

    public get IsWideScreen() { return window.innerWidth > 768; }

    public get RouteLinks() { return this.navigator.RouteLinks; }

    constructor(protected router: Router) {
        super(router);
    }

    ngOnInit(): void {
        this.loadUserList();
    }

    private loadUserList() {
        this.admin.GetAllAdminAsync().then(([succeed, code, error, users]) => {
            if (succeed && code === 0) { this.admins = users; }
        });
        this.admin.GetAllCoreUserAsync().then(([succeed, code, error, users]) => {
            if (succeed && code === 0) { this.cores = users; }
        });
        this.admin.GetAllCommonUserAsync().then(([succeed, code, error, users]) => {
            if (succeed && code === 0) { this.users = users; }
        });
    }
}
