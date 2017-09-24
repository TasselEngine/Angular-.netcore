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

}
