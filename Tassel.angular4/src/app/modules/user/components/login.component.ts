import { ServerService } from './../../../services/server/server.service';
import { TasselNavigationBase } from './../../shared/components/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, HostBinding, OnInit } from '@angular/core';
import { pageShowAnimation } from './../../../utils/app.utils';
import { IdentityService } from '../../../services/app.service';
import { Regex } from 'ws-regex';

@Component({
    selector: 'tassel-login',
    templateUrl: './../views/login.html',
    animations: [pageShowAnimation],
    styleUrls: [
        './../styles/login.css'
    ]
})
export class LoginComponent extends TasselNavigationBase implements OnInit {

    public InputAccount: string;
    public InputPsdt: string;

    private weibo_code: string;

    @HostBinding('@routeAnimation') routeAnimation = true;
    @HostBinding('style.display') display = 'block';

    public get WeiboAuth() {
        const href = Regex.Create(/htt.+\/\/.+?\//).Matches(window.location.href)[0];
        return `${this.server.WeiboOAuthHost}/authorize?client_id=${this.server.WeiboClientID}&response_type=code&redirect_uri=${href}user/login/`;
    }

    constructor(
        public identity: IdentityService,
        private server: ServerService,
        private route: ActivatedRoute,
        protected router: Router) {
        super(router);
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(async queryParams => {
            this.weibo_code = queryParams.code;
            if (this.weibo_code) {
                await this.identity.TryWeiboAccessAsync(this.weibo_code, Regex.Create(/htt.+\/\/.+?\//).Matches(window.location.href)[0]);
                this.navigator.GoHome();
            }
        });
    }

}
