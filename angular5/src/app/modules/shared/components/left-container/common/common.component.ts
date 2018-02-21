import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';
import { TasselNavigationBase } from '../../base.component';
import { IdentityService } from '../../../../../services/app.service';
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

    constructor(protected identity: IdentityService, protected router: Router) {
        super(identity, router);
    }

    ngOnChanges(changes: SimpleChanges): void {
        // for (const propName in changes) {
        //     if (propName === 'show') {

        //     }
        // }
    }

}
