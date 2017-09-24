import { FormatTime } from './../../../utils/extensions/format_time.extensions';
import { ServerService } from './../../../services/server/server.service';
import { TasselComponentBase } from './../../shared/components/base.component';
import { ActivatedRoute } from '@angular/router';
import { Component, HostBinding, OnInit } from '@angular/core';
import { pageShowAnimation } from './../../../utils/app.utils';
import { IdentityService } from '../../../services/app.service';

@Component({
    selector: 'tassel-login',
    templateUrl: './../views/login.html',
    animations: [pageShowAnimation],
    styleUrls: [
        './../styles/login.css'
    ]
})
export class LoginComponent extends TasselComponentBase implements OnInit {

    public InputAccount: string;
    public InputPsdt: string;

    public get WeiboAuth() {
        return `${this.server.WeiboOAuthHost}/authorize?client_id=${this.server.WeiboClientID}&response_type=code&redirect_uri=${window.location.href}`;
    }

    private weibo_code: string;

    @HostBinding('@routeAnimation') routeAnimation = true;
    @HostBinding('style.display') display = 'block';

    constructor(
        public identity: IdentityService,
        private server: ServerService,
        private route: ActivatedRoute) {
        super();
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(queryParams => {
            this.weibo_code = queryParams.code;
            if (this.weibo_code) {
                this.toast.SuccessToast('微博授权成功', this.weibo_code);
                let href = window.location.href;
                const index = href.indexOf('?');
                href = href.substring(0, index);
                this.identity.TryWeiboAccessAsync(this.weibo_code, href);
            }
        });
    }

}
