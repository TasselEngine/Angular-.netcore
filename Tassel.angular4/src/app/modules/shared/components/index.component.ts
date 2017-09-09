import { pageShowAnimation } from './../../extensions/animations/page_show.animation';
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

}
