import { IdentityService } from './../../../services/identity/identity.service';
import { pageShowAnimation } from './../../../utils/app.utils';
import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'tassel-root-index',
    templateUrl: './../views/index.html',
    animations: [pageShowAnimation],
    styleUrls: [
        './../styles/root.css',
    ]
})
export class IndexComponent {

    @HostBinding('@routeAnimation') routeAnimation = true;
    @HostBinding('style.display') display = 'block';

    constructor(private identity: IdentityService) { }

    public Login = () => {
        this.identity.TryLoginAsync('miao17game', '2w3e4r5t');
    }

    public Register = () => {
        this.identity.TryRegisterAsync('miao17game', '2w3e4r5t');
    }

    public Get = () => {
        this.identity.TryGetAllUsersAsync();
    }

    public GetOne = () => {
        this.identity.TryGetUserDetailsAsync();
    }

}
