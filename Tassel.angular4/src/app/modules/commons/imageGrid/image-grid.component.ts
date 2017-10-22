import { Component, Input } from '@angular/core';

// tslint:disable:no-input-rename

@Component({
    selector: 'tassel-common-imggrid',
    templateUrl: './image-grid.html',
    styleUrls: [
        './image-grid.scss',
    ]
})
export class ImageGridComponent {

    @Input('images')
    images: string[];

    @Input('src')
    src: string;

    public get Images() {
        return !this.images ? !this.src ? [] : [[this.src]] :
            this.images.length <= 3 ?
                [this.images] :
                this.images.length <= 6 ?
                    [this.images.slice(0, 3), this.images.slice(3)] :
                    [this.images.slice(0, 3), this.images.slice(3, 6), this.images.slice(6, 9)];
    }

    public get Count(): number { return !this.images ? !this.src ? 0 : 1 : this.images.length; }

}
