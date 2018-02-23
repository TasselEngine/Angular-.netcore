import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';
import { TasselNavigationBase } from '../../base.component';
import { IdentityService } from '../../../../../services/app.service';
import { Router } from '@angular/router';

@Component({
    selector: 'tassel-left-admin',
    templateUrl: './admin.html',
    styleUrls: ['./admin-menu.scss']
})
export class LeftAdminContainerComponent extends TasselNavigationBase implements OnChanges {

    @Input()
    private config: any;
    public get AppMain() { return this.config || {}; }

    @Input()
    public show: boolean;

    public get RouteLinks() { return this.navigator.RouteLinks; }
    public get Logined() { return this.identity.IsLogined || false; }

    constructor(protected router: Router) {
        super(router);
    }

    ngOnChanges(changes: SimpleChanges): void {
        // for (const propName in changes) {
        //     if (propName === 'show') {

        //     }
        // }
    }

}
