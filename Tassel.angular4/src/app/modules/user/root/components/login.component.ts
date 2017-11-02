import { ServerService } from './../../../../services/server/server.service';
import { TasselNavigationBase } from './../../../shared/components/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, HostBinding, OnInit } from '@angular/core';
import { pageShowAnimation } from './../../../../utils/app.utils';
import { IdentityService } from '../../../../services/app.service';
import { Regex } from 'ws-regex';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'tassel-login',
    templateUrl: './../views/login.html',
    animations: [pageShowAnimation],
    styleUrls: [
        './../styles/login.css'
    ]
})
export class LoginComponent extends TasselNavigationBase implements OnInit {

    public showView = false;
    private weibo_code: string;

    validateForm: FormGroup;


    @HostBinding('@routeAnimation') routeAnimation = true;
    @HostBinding('style.display') display = 'block';

    public get WeiboAuth() {
        // const href = Regex.Create(/htt.+\/\/.+?\//).Matches(window.location.href)[0];
        return `${this.server.WeiboOAuthHost}/authorize?client_id=${this.server.WeiboClientID}&response_type=code&redirect_uri=${window.location.href}`;
    }

    public get RouteLinks() { return this.navigator.RouteLinks; }

    constructor(
        private formbuilder: FormBuilder,
        public identity: IdentityService,
        private route: ActivatedRoute,
        protected router: Router) {
        super(identity, router);
    }

    ngOnInit(): void {
        this.validateForm = this.formbuilder.group({
            userName: [null, [Validators.required]],
            password: [null, [Validators.required]],
            remember: [true],
        });
        this.route.queryParams.subscribe(async queryParams => {
            this.weibo_code = queryParams.code;
            if (this.weibo_code) {
                await this.identity.TryWeiboAccessAsync(this.weibo_code, window.location.href.split('?')[0]);
                this.navigator.GoHome();
            } else { this.showView = true; }
        });
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
        this.identity.TryLoginAsync(result.user, result.psd, result.rem, this.navigator.GoHome);
    }

}
