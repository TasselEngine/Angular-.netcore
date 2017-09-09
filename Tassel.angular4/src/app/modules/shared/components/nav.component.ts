import { IdentityService } from './../../../services/identity/identity.service';
import { Component } from '@angular/core';
@Component({
    selector: 'tassel-nav',
    templateUrl: './../views/nav.html',
    styleUrls: [
        './../styles/nav.css',
    ],
})
export class NavComponent {

    constructor(private identity: IdentityService) { }

} 
