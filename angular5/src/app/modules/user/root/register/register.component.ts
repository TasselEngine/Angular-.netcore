import { ServerService } from './../../../../services/server/server.service';
import { TasselNavigationBase } from './../../../shared/components/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, HostBinding, OnInit, Input, OnDestroy } from '@angular/core';
import { pageShowAnimation } from './../../../../utils/app.utils';
import { IdentityService, RootService } from '../../../../services/app.service';
import { Regex } from 'ws-regex';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { EqualValidator } from '../../../extensions/directives/form_valid.directive';
import { ServerStatus } from '../../../../model/app.model';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

interface IUser {
    InputAccount: string;
    InputPsdt: string;
    ConfirmPsdt: string;
    Remember: boolean;
}

@Component({
    selector: 'tassel-register',
    templateUrl: './register.html',
    animations: [pageShowAnimation],
    styleUrls: [
        './../styles/login.scss'
    ]
})
export class RegisterComponent extends TasselNavigationBase implements OnInit, OnDestroy {

    public validateForm: FormGroup;
    private user: IUser = {
        InputAccount: null,
        InputPsdt: null,
        ConfirmPsdt: null,
        Remember: true
    };

    private confirm = new Subject<ValidationErrors>();
    private name = new Subject<string>();

    private is_name_ok = false;
    private name_exist_error: string;
    public get NameAvalible() { return this.is_name_ok; }
    public get NameError() { return this.name_exist_error; }

    @HostBinding('@routeAnimation') routeAnimation = true;
    @HostBinding('style.display') display = 'block';

    private confirmSubs: Subscription;
    private nameSubs: Subscription;
    private nameExistSubs: Subscription;

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
            userName: [this.user.InputAccount, [Validators.required]],
            password: [this.user.InputPsdt, [Validators.required]],
            recomf: [this.user.ConfirmPsdt, [Validators.required]],
            remember: [this.user.Remember],
        });
        this.confirmSubs = this.confirm.debounceTime(300).distinctUntilChanged().subscribe(result => {
            if (result) { this.validateForm.controls.recomf.setErrors(result); }
        });
        this.nameSubs = this.name.debounceTime(300).distinctUntilChanged().subscribe(name => {
            const nameRetuen = this.identity.CheckUserName(name);
            this.nameExistSubs = nameRetuen.subscribe(i => {
                this.is_name_ok = i.status === ServerStatus.Succeed;
                this.name_exist_error = i.msg;
                if (!this.is_name_ok) {
                    this.validateForm.controls.userName.setErrors({ userNameExist: { value: i.msg } });
                }
            });
        }, error => {
            this.is_name_ok = false;
            this.name_exist_error = 'server errors';
        });
    }

    ngOnDestroy(): void {
        if (this.confirmSubs) { this.confirmSubs.unsubscribe(); }
        if (this.nameSubs) { this.nameSubs.unsubscribe(); }
        if (this.nameExistSubs) { this.nameExistSubs.unsubscribe(); }
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

    public OnUserNameInput = () => {
        this.name.next(this.validateForm.value.userName);
    }

    public OnPsdInput = () => {
        this.user.InputPsdt = this.validateForm.value.password;
    }

    public CheckConfirm = () => {
        this.confirm.next(EqualValidator(this.user.InputPsdt)(this.validateForm.controls.recomf));
    }

    public SubmitForm = async () => {
        for (const i in this.validateForm.controls) {
            if (i) { this.validateForm.controls[i].markAsDirty(); }
        }
        if (this.validateForm.invalid) { return; }
        const result = this.prepareSaveModel();
        if (result.psd_recf !== result.psd) { return; }
        this.identity.TryRegisterAsync(result.user, result.psd, result.rem, () => this.navigator.GoHome());
    }

}
