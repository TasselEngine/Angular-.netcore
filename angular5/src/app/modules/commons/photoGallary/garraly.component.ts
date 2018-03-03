import { Component, Input, OnInit, OnChanges, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Config, Image } from './contract';

@Component({
    selector: 'tassel-photo-gallary',
    templateUrl: './gallary.html',
    styleUrls: ['./gallary.scss']
})
export class PhotoGallaryComponent implements OnInit, OnChanges {

    @Input('images')
    private images: Config;
    private copy: Image[];
    public get Images() { return this.copy; }

    @Output()
    OnGallaryClosed = new EventEmitter<any>();

    private showPop: boolean;
    public get ShowPop() { return this.showPop || false; }

    public hideImage = true;

    private current: Image;
    public get Current() { return this.current; }

    public Disposed = true;

    constructor() {

    }

    ngOnInit(): void {
        this.showPop = false;
    }

    ngOnChanges(changes: SimpleChanges): void {
        for (const propName in changes) {
            if (propName === 'images' && changes[propName].currentValue) {
                const config: Config = changes[propName].currentValue;
                this.copy = config.images.map(i => ({ thumb: config.root + i.thumb, origin: config.root + i.origin }));
                this.current = this.copy[config.selected];
                this.hideImage = true;
                this.Disposed = false;
                setTimeout(() => this.showPop = true, 20);
            }
        }
    }

    public CloseThis() {
        this.showPop = false;
        this.OnGallaryClosed.emit(new Date());
        setTimeout(() => this.Disposed = true, 350);
    }

    public OnItemClicked(item: Image) {
        this.hideImage = true;
        this.current = item;
    }

    public OnCurrentLoaded() {
        this.hideImage = false;
    }

}
