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

    @HostBinding('@routeAnimation') routeAnimation = true;
    @HostBinding('style.display') display = 'block';

    constructor(
        public identity: IdentityService,
        private server: ServerService,
        private route: ActivatedRoute) {
        super();
    }

    ngOnInit(): void {

    }

}
