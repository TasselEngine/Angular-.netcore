import { pageShowAnimation } from './../../../utils/app.utils';
import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'tassel-settings-index',
    templateUrl: './../views/index.html',
    animations: [pageShowAnimation],
    styleUrls: [
        './../styles/settings.css',
    ]
})
export class SettingsIndexComponent {

    @HostBinding('@routeAnimation') routeAnimation = true;
    @HostBinding('style.display') display = 'block';

}
