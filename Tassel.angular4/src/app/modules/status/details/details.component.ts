import { Logger } from 'ws-logger';
import { Router, ActivatedRoute } from '@angular/router';
import { IdentityService, ServerService, StatusService } from './../../../services/app.service';
import { Component, HostBinding, OnInit } from '@angular/core';
import { pageShowAnimation } from '../../../utils/app.utils';
import { TasselNavigationBase } from '../../shared/components/base.component';
import { Status, ServerStatus } from '../../../model/app.model';



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
    public get VM() { return this.model; }

    public get ImageSrcRoot() { return this.server.ServerApiRoot; }

    private logger: Logger<StatusDetailsComponent>;

    constructor(
        private server: ServerService,
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

    public readonly OnImageClicked = (img_src: string) => {
        console.log(img_src);
    }

}
