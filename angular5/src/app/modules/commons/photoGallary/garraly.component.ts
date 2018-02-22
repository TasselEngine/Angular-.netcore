import { Component, Input, OnInit, OnChanges, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Image, IPhotoGallaryConfig } from '../../../model/app.model';

@Component({
    selector: 'tassel-photo-gallary',
    templateUrl: './gallary.html',
    styleUrls: ['./gallary.scss']
})
export class PhotoGallaryComponent implements OnInit, OnChanges {

    @Input('images')
    public images: IPhotoGallaryConfig;
    public get Images() { return this.images.images; }

    @Output()
    OnGallaryClosed = new EventEmitter<any>();

    private showPop: boolean;
    public get ShowPop() { return this.showPop || false; }

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
                console.log(this.images);
                const config: IPhotoGallaryConfig = changes[propName].currentValue;
                this.current = config.images[config.selected];
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

    }

}
