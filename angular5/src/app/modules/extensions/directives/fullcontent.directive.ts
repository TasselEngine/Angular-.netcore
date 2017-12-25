import { Directive, ElementRef, Input } from '@angular/core';

@Directive({ selector: '[TasselFullContent]' })
export class FullContentDirective {
    constructor(el: ElementRef) {
        el.nativeElement.style.height = '100%';
    }
}
