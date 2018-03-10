import { Router } from '@angular/router';
import { IdentityService } from './../../../../services/identity/identity.service';
import { pageShowAnimation } from './../../../../utils/app.utils';
import { OnInit, HostBinding, Component, OnDestroy } from '@angular/core';
import { TasselNavigationBase } from './../../../shared/components/base.component';

@Component({
    selector: 'tassel-user-message-box',
    templateUrl: './msg-box.html',
    animations: [pageShowAnimation],
    styleUrls: [
        './msg-box.scss'
    ]
})
export class MessageBoxComponent extends TasselNavigationBase implements OnInit, OnDestroy {

    @HostBinding('@routeAnimation') routeAnimation = true;
    @HostBinding('style.display') display = 'block';

    public get IsWideScreen() { return window.innerWidth > 768; }

    constructor(protected router: Router) { super(router); }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {

    }

}
