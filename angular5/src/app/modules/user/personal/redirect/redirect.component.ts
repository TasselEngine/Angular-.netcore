import { pageShowAnimation } from './../../../../utils/animations/page_show.animation';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { TasselNavigationBase } from '../../../shared/components/base.component';
import { IdentityService } from '../../../../services/app.service';
import { ServerStatus, RouteErrors } from '../../../../model/app.model';

@Component({
    selector: 'tassel-user-redirect',
    templateUrl: 'redirect.html',
    animations: [pageShowAnimation],
    styleUrls: [
        './redirect.scss'
    ]
})
export class UserRedirectComponent extends TasselNavigationBase implements OnInit {

    constructor(
        private location: Location,
        private route: ActivatedRoute,
        protected identity: IdentityService,
        protected router: Router) {
        super(identity, router);
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(queryParams => {
            const from = queryParams.from;
            this.route.params.subscribe(async params => {
                const uid = params.uname;
                const [succeed, code, error, response] = await this.identity.GetUserDetailsAsync(uid);
                // Reset the top of history stack.
                this.location.replaceState(from);
                if (!succeed || code !== ServerStatus.Succeed) {
                    this.navigator.GoToNotFound(RouteErrors.UserNotFound);
                } else {
                    this.navigator.GoToUserProfile(response.UserName);
                }
            });
        });
    }

}
