import { Directive, ElementRef, Input, HostListener, HostBinding } from '@angular/core';

@Directive({ selector: '[TasselPaddingLR]' })
export class PaddingLRDirective {

    @HostBinding('style.padding-left')
    public get paddingLeft() { return this.readPadding(true); }

    @HostBinding('style.padding-right')
    public get paddingRight() { return this.readPadding(false); }

    @Input() TasselPaddingLR: number | [number, number];

    constructor(el: ElementRef) { }

    private readPadding = (isLeft: boolean): string => {
        if (!this.TasselPaddingLR) { return '0px'; }
        if (this.TasselPaddingLR instanceof Array) {
            return `${this.TasselPaddingLR[isLeft ? 0 : 1]}px`;
        } else {
            return this.TasselPaddingLR + 'px';
        }
    }

}
