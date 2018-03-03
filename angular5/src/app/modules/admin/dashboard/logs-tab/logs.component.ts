import { Router } from '@angular/router';
import { TasselAdminCompBase } from './../../../shared/components/base.component';
import { Component, HostBinding, OnInit } from '@angular/core';
import { AdminService, IdentityService, ResourcesService } from '../../../../services/app.service';
import { Logger } from 'ws-logger';
import { ApplicationLog } from '../../../../model/app.model';

@Component({
    selector: 'tassel-admin-logs',
    templateUrl: './logs.html',
    styleUrls: [
        './logs.scss'
    ]
})
export class AdminDashLogsComponent extends TasselAdminCompBase implements OnInit {

    private logs: Array<ApplicationLog> = [];
    public get Logs() { return this.logs || []; }

    public IsEnd = false;
    public IsLoading = false;

    private get loadCount() { return this.IsWideScreen ? 20 : 10; }

    public get IsWideScreen() { return window.innerWidth > 768; }

    public get RouteLinks() { return this.navigator.RouteLinks; }

    private logger: Logger<AdminDashLogsComponent>;

    constructor(protected router: Router, private resources: ResourcesService) {
        super(router);
        this.logger = this.logsrv.GetLogger('AdminDashLogsComponent').SetModule('Admin');
    }

    ngOnInit(): void {
        this.loadLogs();
    }


    private async loadLogs(skip = 0) {
        this.IsLoading = true;
        const [succeed, code, error, logs] = await this.admin.LoadApplicationLogsAsync(this.loadCount, skip);
        if (succeed && code === 0) {
            logs.forEach(log => log.TargetKey = log.TargetKey ? this.formater.ImageTickParse(log.TargetKey || '', this.resources.AllStickersGroup) : log.TargetKey);
            this.logs.push(...logs);
            if (logs.length === 0) {
                this.IsEnd = true;
            }
            this.IsLoading = false;
        } else {
            this.IsLoading = false;
        }
    }

    public LoadMore() {
        if (this.IsEnd) { return; }
        this.loadLogs(this.logs.length);
    }
}
