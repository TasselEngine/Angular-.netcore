import { Component, Output, EventEmitter } from '@angular/core';
import { FormatService, ResourcesService } from '../../../services/app.service';
import { ISticker } from '../../../model/app.model';

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

    public get TiebaImages() { return this.resources.TiebaImages; }
    public get OthersStickers() { return this.resources.OthersStickers; }
    public get SinaPopStickers() { return this.resources.SinaPopStickers; }
    public get SinaRoleStickers() { return this.resources.SinaRoleStickers; }
    public get AllResources() { return this.resources.AllStickersGroup; }

    public get Formator() { return this.formator; }

    constructor(
        private resources: ResourcesService,
        private formator: FormatService) { }

    public readonly StickerClicked = (image: ISticker) => {
        this.OnStickerClicked.emit(image);
    }

}
