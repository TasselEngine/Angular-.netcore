import { IdentityService } from './../../../services/identity.service';
import { Component } from '@angular/core';
@Component({
    selector: 'app-nav',
    templateUrl: './../views/nav.html',
    styleUrls: [
        './../styles/nav.css',
    ],
})
export class NavComponent {

    constructor(private identity: IdentityService) { }

} 
