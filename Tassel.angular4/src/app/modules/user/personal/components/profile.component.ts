import { Router } from '@angular/router';
import { IdentityService } from './../../../../services/identity/identity.service';
import { pageShowAnimation } from './../../../../utils/app.utils';
import { OnInit, HostBinding, Component } from '@angular/core';
import { TasselNavigationBase } from './../../../shared/components/base.component';

@Component({
    selector: 'tassel-user-profile',
    templateUrl: './../views/profile.html',
    animations: [pageShowAnimation],
    styleUrls: [
        './../styles/profile.css'
    ]
})
export class ProfileComponent extends TasselNavigationBase implements OnInit {

    @HostBinding('@routeAnimation') routeAnimation = true;
    @HostBinding('style.display') display = 'block';

    constructor(
        protected identity: IdentityService,
        protected router: Router) { super(identity, router); }

    ngOnInit(): void {

    }

}
