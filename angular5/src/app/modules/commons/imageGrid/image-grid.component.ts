import { Component, Input, EventEmitter, Output } from '@angular/core';

// tslint:disable:no-input-rename

@Component({
    selector: 'tassel-common-imggrid',
    templateUrl: './image-grid.html',
    styleUrls: [
        './image-grid.scss',
    ]
})
export class ImageGridComponent {

    @Input('gridType')
    private gridType: 'divide' | 'grid' = 'divide';
    public get DivideType(): boolean { return this.gridType === 'divide' ? true : false; }

    @Input('images')
    images: string[];

    @Input('src')
    src: string;

    @Input('width')
    private width: number;
    public get ImgWidth() { return this.width || 160; }

    @Input('limit')
    limit = false;

    @Input('canPointer')
    private canPointer = false;
    public get CanPointer(): boolean { return this.canPointer === true; }

    @Output('ImageClicked')
    ImageClicked = new EventEmitter<any>();

    public get GridImages() {
        return this.limit ?
            (this.images || []).slice(0, 9) :
            this.images || [];
    }

    public get Images() {
        return !this.images ? !this.src ? [] : [[this.src]] :
            this.images.length <= 3 ?
                [this.images] :
                this.images.length === 4 ?
                    [this.images.slice(0, 2), this.images.slice(2)] :
                    this.images.length <= 6 ?
                        [this.images.slice(0, 3), this.images.slice(3)] :
                        [this.images.slice(0, 3), this.images.slice(3, 6), this.images.slice(6, 9)];
    }

    public get Count(): number { return !this.images ? !this.src ? 0 : 1 : this.images.length; }

    public readonly OnImageClicked = (img_src: string) => {
        if (this.canPointer) {
            this.ImageClicked.emit(img_src);
        }
    }

}
