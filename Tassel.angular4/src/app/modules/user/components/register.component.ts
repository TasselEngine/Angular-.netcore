import { ServerService } from './../../../services/server/server.service';
import { TasselNavigationBase } from './../../shared/components/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, HostBinding, OnInit, Input } from '@angular/core';
import { pageShowAnimation } from './../../../utils/app.utils';
import { IdentityService } from '../../../services/app.service';
import { Regex } from 'ws-regex';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { EqualValidator } from '../../extensions/directives/form_valid.directive';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

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

    private confirm = new Subject<ValidationErrors>();

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
        this.confirm.debounceTime(300).distinctUntilChanged().subscribe(result => {
            if (result) { this.validateForm.controls.recomf.setErrors(result); }
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

    public OnPsdInput = () => {
        this.user.InputPsdt = this.validateForm.value.password;
    }

    public CheckConfirm = () => {
        this.confirm.next(EqualValidator(this.user.InputPsdt)(this.validateForm.controls.recomf));
    }

    public SubmitForm = async () => {
        console.log(this.validateForm.controls.recomf);
        for (const i in this.validateForm.controls) {
            if (i) { this.validateForm.controls[i].markAsDirty(); }
        }
        if (this.validateForm.invalid) { return; }
        const result = this.prepareSaveModel();
        if (result.psd_recf !== result.psd) { return; }
        this.identity.TryRegisterAsync(result.user, result.psd, result.rem, this.navigator.GoHome);
    }

}
