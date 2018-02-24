import { ServerService } from './../../../../services/server/server.service';
import { TasselNavigationBase } from './../../../shared/components/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { pageShowAnimation } from './../../../../utils/app.utils';
import { IdentityService, RootService } from '../../../../services/app.service';
import { Regex } from 'ws-regex';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'tassel-login',
    templateUrl: './login.html',
    animations: [pageShowAnimation],
    styleUrls: [
        './../styles/login.scss'
    ]
})
export class LoginComponent extends TasselNavigationBase implements OnInit, OnDestroy {

    public showView = false;
    public showLoading = false;
    private weibo_code: string;
    private redirect_url: string;

    validateForm: FormGroup;

    @HostBinding('@routeAnimation') routeAnimation = true;
    @HostBinding('style.display') display = 'block';

    public get WeiboAuth() {
        return `${this.server.WeiboOAuthHost}/authorize?client_id=${this.server.WeiboClientID}&response_type=code&redirect_uri=${window.location.href.split('?')[0]}`;
    }

    public get IsWideScreen() { return window.innerWidth > 768; }

    public get RouteLinks() { return this.navigator.RouteLinks; }

    constructor(
        private root: RootService,
        private formbuilder: FormBuilder,
        public identity: IdentityService,
        private route: ActivatedRoute,
        protected router: Router) {
        super(router);
    }

    ngOnInit(): void {
        this.validateForm = this.formbuilder.group({
            userName: [null, [Validators.required]],
            password: [null, [Validators.required]],
            remember: [true],
        });
        this.route.queryParams.subscribe(async queryParams => {
            this.weibo_code = queryParams.code;
            this.redirect_url = queryParams.redirect;
            if (this.weibo_code) {
                this.showLoading = true;
                await this.identity.TryWeiboAccessAsync(this.weibo_code, window.location.href.split('?')[0]);
                if (this.redirect_url) {
                    this.navigator.GoToPath(this.redirect_url);
                } else {
                    this.navigator.GoHome();
                }
            } else { this.showView = true; }
        });
    }

    ngOnDestroy(): void {
    }

    prepareSaveModel = (): any => {
        const formModel = this.validateForm.value;
        const result = {
            user: formModel.userName as string,
            psd: formModel.password as string,
            rem: formModel.remember as boolean,
        };
        return result;
    }

    public SubmitForm = async () => {
        for (const i in this.validateForm.controls) {
            if (i) { this.validateForm.controls[i].markAsDirty(); }
        }
        if (this.validateForm.invalid) { return; }
        const result = this.prepareSaveModel();
        this.identity.TryLoginAsync(result.user, result.psd, result.rem, () => {
            if (this.redirect_url) {
                this.navigator.GoToPath(this.redirect_url);
            } else {
                this.navigator.GoHome();
            }
        });
    }

}
