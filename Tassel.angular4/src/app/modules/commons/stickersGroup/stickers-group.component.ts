import { Component, Output, EventEmitter } from '@angular/core';
import { FormatService, ResourcesService } from '../../../services/app.service';

interface ISticker {
    key: String;
    value: string;
}

@Component({
    selector: 'tassel-common-stickers',
    templateUrl: 'stickers-group.html',
    styleUrls: [
        'stickers-group.scss'
    ]
})
export class StickersGroupComponent {

    @Output()
    OnStickerClicked = new EventEmitter<ISticker>();

    constructor(
        private resources: ResourcesService,
        private formator: FormatService) { }

}
