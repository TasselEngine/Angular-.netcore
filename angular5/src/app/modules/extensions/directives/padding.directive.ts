import { Directive, ElementRef, Input, HostListener, HostBinding } from '@angular/core';

@Directive({ selector: '[wsPadding]' })
export class PaddingDirective {

    @HostBinding('style.padding-left')
    public get paddingLeft() { return this.readPadding(true, 3); }

    @HostBinding('style.padding-right')
    public get paddingRight() { return this.readPadding(true, 1); }

    @HostBinding('style.padding-top')
    public get paddingTop() { return this.readPadding(false, 0); }

    @HostBinding('style.padding-bottom')
    public get paddingBottom() { return this.readPadding(false, 2); }

    @Input() wsPadding: number | [number, number];

    @Input('details') PaddingDetails: [number, number, number, number];

    constructor(el: ElementRef) { }

    private readPadding = (isLR: boolean, index?: number): string => {
        if (this.PaddingDetails) {
            return `${this.PaddingDetails[index || 0]}px`;
        }
        if (!this.wsPadding) { return '0px'; }
        if (this.wsPadding instanceof Array) {
            return `${this.wsPadding[isLR ? 0 : 1]}px`;
        } else {
            return this.wsPadding + 'px';
        }
    }

}
