import { ServerService } from './../../../services/server/server.service';
import { TasselNavigationBase } from './../../shared/components/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, HostBinding, OnInit, Input } from '@angular/core';
import { pageShowAnimation } from './../../../utils/app.utils';
import { IdentityService } from '../../../services/app.service';
import { Regex } from 'ws-regex';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

interface IUser {
    InputAccount: string;
    InputPsdt: string;
    ConfirmPsdt: string;
    Remember: boolean;
}

@Component({
    selector: 'tassel-register',
    templateUrl: './../views/register.html',
    animations: [pageShowAnimation],
    styleUrls: [
        './../styles/login.css'
    ]
})
export class RegisterComponent extends TasselNavigationBase implements OnInit {

    public validateForm: FormGroup;
    private user: IUser = {
        InputAccount: null,
        InputPsdt: null,
        ConfirmPsdt: null,
        Remember: true
    };

    @HostBinding('@routeAnimation') routeAnimation = true;
    @HostBinding('style.display') display = 'block';

    public get RouteLinks() { return this.navigator.RouteLinks; }

    constructor(
        private formbuilder: FormBuilder,
        public identity: IdentityService,
        private server: ServerService,
        private route: ActivatedRoute,
        protected router: Router) {
        super(router);
    }

    ngOnInit(): void {
        this.validateForm = this.formbuilder.group({
            userName: [this.user.InputAccount, [Validators.required]],
            password: [this.user.InputPsdt, [Validators.required]],
            recomf: [this.user.ConfirmPsdt, [Validators.required]],
            remember: [this.user.Remember],
        });
    }

    prepareSaveModel = () => {
        const formModel = this.validateForm.value;
        const result = {
            user: formModel.userName as string,
            psd: formModel.password as string,
            psd_recf: formModel.recomf as string,
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
        if (result.psd_recf !== result.psd) { return; }
        this.identity.TryRegisterAsync(result.user, result.psd, result.rem, this.navigator.GoHome);
    }

}
