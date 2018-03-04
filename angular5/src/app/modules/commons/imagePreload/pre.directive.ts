import { Directive, ElementRef, Input, HostListener, HostBinding, OnChanges, SimpleChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { Container } from './cache';

// tslint:disable-next-line:directive-selector
@Directive({ selector: '[ws-pre-temp]' })
export class PreImageTemplateDirective {
    constructor(public el: ElementRef) { }
}

// tslint:disable-next-line:directive-selector
@Directive({ selector: '[ws-image]' })
export class PreLoadingImageDirective implements OnInit, OnChanges {

    @Input('fluent')
    private openAimation = true;

    @Input('data-src')
    private src: string;
    private imagesrc: string;

    @Input('data-width')
    private width: number;

    @Input('data-height')
    private height: number;

    @Input('width')
    private styWidth: string;

    @Input('height')
    private styHeight: string;

    @HostBinding('src')
    public get ImageSrc() { return this.imagesrc; }

    @HostBinding('style.width')
    public get StyleWidth() { return !this.width ? (this.styWidth || '100%') : this.width + 'px'; }

    @HostBinding('style.height')
    public get StyleHeight() { return (!this.height ? (this.styHeight || '100%') : this.height + 'px') || this.StyleWidth; }

    @HostBinding('class.notshow')
    private get notshowAnima() { return true; }

    @HostBinding('class.show')
    private get showAnima() { return this.loaded; }

    @Output('onload')
    OnLoaded = new EventEmitter<any>();

    private element: HTMLImageElement;
    private cache = Container;
    private loaded = false;

    constructor(private el: ElementRef) {
        this.element = el.nativeElement;
    }

    ngOnInit(): void {
        if (this.cache.Check(this.src)) {
            setTimeout(() => {
                this.imagesrc = this.src;
                this.loaded = true;
                this.OnLoaded.emit(new Date());
            });
            return;
        } else {
            setTimeout(() => this.imagesrc = this.src, 20);
        }
        this.element.onload = () => {
            if (this.openAimation) {
                setTimeout(() => this.loaded = true, 0);
            } else {
                this.loaded = true;
            }
            this.OnLoaded.emit(new Date());
        };
    }

    ngOnChanges(changes: SimpleChanges): void {

    }

}
