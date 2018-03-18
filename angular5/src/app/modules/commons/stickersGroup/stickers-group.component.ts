import { Component, Output, EventEmitter, Input, OnInit, OnDestroy } from '@angular/core';
import { FormatService, ResourcesService, IdentityService } from '../../../services/app.service';
import { ISticker } from '../../../model/app.model';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';

@Component({
    selector: 'tassel-common-stickers',
    templateUrl: 'stickers-group.html',
    styleUrls: [
        'stickers-group.scss'
    ]
})
export class StickersGroupComponent implements OnInit, OnDestroy {

    @Input()
    public uploadEnabled = false;

    @Output()
    OnStickerClicked = new EventEmitter<ISticker>();

    public get TiebaImages() { return this.resources.TiebaImages; }
    public get OthersStickers() { return this.resources.OthersStickers; }
    public get SinaPopStickers() { return this.resources.SinaPopStickers; }
    public get SinaRoleStickers() { return this.resources.SinaRoleStickers; }
    public get ArusStickers() { return this.resources.ArusStickers; }
    public get AllResources() { return this.resources.AllStickersGroup; }

    public get Formator() { return this.formator; }

    private _caches: { [propName: string]: ISticker[] } = {};
    public get cache() { return this._caches[this.identity.CurrentUUID] || []; }
    public set cache(value: ISticker[]) { this._caches[this.identity.CurrentUUID] = value; }

    private colls = [];
    public get stickers() { return this.colls; }

    private addor = new Subject<ISticker>();
    private addSubp: Subscription;

    constructor(
        private identity: IdentityService,
        private resources: ResourcesService,
        private formator: FormatService) {
        this._caches = JSON.parse(window.localStorage.getItem('ws-sticker-caches') || '{}');
    }

    ngOnInit(): void {
        this.colls = [
            { title: 'Tieba', colls: this.TiebaImages, size: 21, itemSize: 28, cover: this.url('/tieba/middle/25.png') },
            { title: 'Aru', colls: this.ArusStickers, size: 21, itemSize: 24, cover: this.url('/aru/asurprised.png') },
            { title: 'Weibo 01', colls: this.SinaPopStickers, size: 22, itemSize: 28, cover: this.url('/sina/pop/mogician.png') },
            { title: 'Weibo 02', colls: this.SinaRoleStickers, size: 22, itemSize: 28, cover: this.url('/sina/role/ameng-smg.png') },
            { title: 'Others', colls: this.OthersStickers, size: 22, itemSize: 28, cover: this.url('/sina/others/doge.png') }
        ];
        this.addSubp = this.addor.debounceTime(500).subscribe(image => {
            this.addStickerCache(image);
        });
    }

    ngOnDestroy(): void {
        this.addSubp.unsubscribe();
    }

    private url(path: string) {
        return this.Formator.ImageConnect('/resources/system/images' + path);
    }

    public readonly StickerClicked = (image: ISticker) => {
        this.OnStickerClicked.emit(image);
        this.addor.next(image);
    }

    private addStickerCache(image: ISticker) {
        if (!this.cache) {
            this._caches[this.identity.CurrentUUID || 'not_login'] = [];
        }
        const found = this.cache.findIndex(i => i.key === image.key);
        if (found >= 0) {
            this.cache.splice(found, 0);
            this.cache.unshift(image);
        } else {
            this.cache.unshift(image);
        }
        this.cache = this.cache.filter((value, index, self) => self.indexOf(value) === index);
        if (this.cache.length > 27) {
            this.cache = this.cache.slice(0, 27);
        }
        window.localStorage.setItem('ws-sticker-caches', JSON.stringify(this._caches));
        this.cache = [...this.cache];
    }

}
