import { Directive, ElementRef, Input } from '@angular/core';

@Directive({ selector: '[wsFullContent]' })
export class FullContentDirective {
    constructor(el: ElementRef) {
        el.nativeElement.style.height = '100%';
    }
}
