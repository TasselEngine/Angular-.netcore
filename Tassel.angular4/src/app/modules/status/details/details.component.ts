import { Logger } from 'ws-logger';
import { StatusService } from './../../../services/status/status.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IdentityService } from './../../../services/identity/identity.service';
import { Component, HostBinding, OnInit } from '@angular/core';
import { pageShowAnimation } from '../../../utils/app.utils';
import { TasselNavigationBase } from '../../shared/components/base.component';
import { ServerStatus } from '../../../model/interfaces/response.interface';
import { Status } from '../../../model/app.model';



@Component({
    selector: 'tassel-status-details',
    templateUrl: 'details.html',
    animations: [pageShowAnimation],
    styleUrls: [
        'status-details.scss'
    ]
})
export class StatusDetailsComponent extends TasselNavigationBase implements OnInit {

    @HostBinding('@routeAnimation') routeAnimation = true;
    @HostBinding('style.display') display = 'block';

    private status_id: string;
    private model: Status;
    public get Status() { return this.model; }

    private logger: Logger<StatusDetailsComponent>;

    constructor(
        private route: ActivatedRoute,
        private status: StatusService,
        protected identity: IdentityService,
        protected router: Router) {
        super(identity, router);
        this.logger = this.logsrv.GetLogger('StatusDetailsComponent').SetModule('status');
    }

    ngOnInit(): void {
        this.route.params.subscribe(async params => {
            this.status_id = params.statusid;
            const [succeed, code, error, details] = await this.status.GetStatusAsync(this.status_id);
            if (!succeed) {
                this.logger.Error(['Get status details failed', 'Server error'], 'ngOnInit');
                return;
            }
            if (code === ServerStatus.Succeed) {
                this.model = details;
            } else {
                this.logger.Warn(['Get status details failed', 'See the details : ', error.msg], 'ngOnInit');
                this.navigator.GoToNotFound();
            }
        });
    }

}
