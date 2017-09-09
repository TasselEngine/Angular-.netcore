import { IdentityService } from './../../../services/identity/identity.service';
import { Component } from '@angular/core';

@Component({
  selector: 'tassel-root',
  templateUrl: './../views/root.html',
  styleUrls: ['./../styles/root.css']
})
export class RootComponent {

  constructor(private identity: IdentityService) { }

}
