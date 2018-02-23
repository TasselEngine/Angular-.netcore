import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';
import { TasselNavigationBase } from '../../base.component';
import { IdentityService, StatusService } from '../../../../../services/app.service';
import { Router } from '@angular/router';

@Component({
    selector: 'tassel-left-common',
    templateUrl: './common.html',
    styleUrls: ['./../../root/root.scss']
})
export class LeftCommonContainerComponent extends TasselNavigationBase implements OnChanges {

    @Input()
    private config: any;
    public get AppMain() { return this.config || {}; }

    @Input()
    public show: boolean;

    public get RouteLinks() { return this.navigator.RouteLinks; }
    public get Logined() { return this.identity.IsLogined || false; }

    constructor(
        private status: StatusService,
        protected identity: IdentityService,
        protected router: Router) {
        super(identity, router);
    }

    ngOnChanges(changes: SimpleChanges): void {

    }

    public RefreshStatusAndGo() {
        this.status.ClearStatusCollection();
        this.navigator.GoToStatusIndex();
    }

}
