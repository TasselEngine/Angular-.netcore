import { Component, Input, OnInit, OnChanges, Output, EventEmitter, SimpleChanges, ElementRef, TemplateRef, ViewChild } from '@angular/core';

@Component({
    selector: 'tassel-pre-image',
    templateUrl: './pre-image.html',
    styleUrls: ['./pre-image.scss']
})
export class PreloadingImageComponent implements OnInit, OnChanges {

    @Input('src')
    private origin: string;
    private url: string;
    public get URL() { return this.url; }

    @Input('default')
    private default: string | ElementRef;
    public get Default() { return this.default; }
    public get IsURL() { return this.default && typeof (this.default) === 'string'; }
    public get IsTempRef() { return this.default && typeof (this.default) !== 'string'; }
    public get IsDefault() { return !this.default; }

    @Input()
    private unit: number;
    public get Unit() { return this.unit || ''; }

    @Input()
    private width: number;
    public get Width() { return (this.width + this.unit) || '100%'; }

    @Input()
    private height: number;
    public get Height() { return ((this.height || this.width) + this.unit) || '100%'; }

    @Input('css')
    private css: string;
    public get Css() { return this.css || ''; }

    @Input()
    private timeout = 0;

    @Input()
    private absolute: boolean;
    public get IsAbsolute() { return this.absolute || false; }

    @ViewChild('default')
    public defaultLoading: ElementRef;

    @Output('onload')
    OnLoaded = new EventEmitter<any>();

    @Output('onclick')
    OnClicked = new EventEmitter<any>();

    public hideimage = true;
    public showPic = false;
    public showTemp = false;
    public Disposed = false;

    constructor() {

    }

    ngOnInit(): void {
        setTimeout(() => this.showTemp = true, 20);
        setTimeout(() => this.url = this.origin, this.timeout);
    }

    ngOnChanges(changes: SimpleChanges): void {
        for (const propName in changes) {
            if (propName === 'src' && changes[propName].currentValue) {
                this.showPic = false;
                this.url = this.origin;
                this.hideimage = true;
                setTimeout(() => this.showPic = true, 20);
            }
        }
    }

    public OnCurrentLoaded(event) {
        this.hideimage = false;
        setTimeout(() => this.showPic = true, 20);
        this.OnLoaded.emit(event);
    }

    public OnCurrentClicked(event) {
        this.OnClicked.emit(event);
    }

}
