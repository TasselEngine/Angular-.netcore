import { Router } from '@angular/router';
import { IdentityService } from './../../../../services/identity/identity.service';
import { pageShowAnimation } from './../../../../utils/app.utils';
import { OnInit, HostBinding, Component, OnDestroy } from '@angular/core';
import { TasselNavigationBase } from './../../../shared/components/base.component';

@Component({
    selector: 'tassel-user-profile',
    templateUrl: './profile.html',
    animations: [pageShowAnimation],
    styleUrls: [
        './profile.scss'
    ]
})
export class ProfileComponent extends TasselNavigationBase implements OnInit, OnDestroy {

    @HostBinding('@routeAnimation') routeAnimation = true;
    @HostBinding('style.display') display = 'block';

    constructor(protected router: Router) { super(router); }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {

    }

}
