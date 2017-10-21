import { Directive, ViewContainerRef } from '@angular/core';

// tslint:disable:directive-selector

@Directive({
    selector: '[content-host]',
})
export class ContentHostDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}
