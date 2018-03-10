import { Directive, Input, ViewContainerRef, ElementRef, OnInit } from '@angular/core';
import { I18N } from './i18n.service';

// tslint:disable-next-line:directive-selector
@Directive({ selector: '[xi18n]' })
export class WSi18nDirective implements OnInit {

    @Input('xi18n') i18n: string;

    @Input('section') prefix: string;

    @Input() type: 'value' | 'inner' = 'inner';

    constructor(private view: ElementRef, private _i18n: I18N) {

    }

    ngOnInit(): void {
        const [value, id] = this._i18n.CheckIdName(this.i18n || '', true);
        if (id) {
            this.view.nativeElement.id = id;
        }
        if (id) {
            return this._i18n.Get(this.i18n, id, true, true, this.prefix);
        }
        if (this.type === 'inner') {
            this.view.nativeElement.innerText = this._i18n.Get(this.i18n || this.view.nativeElement.innerText || value, null, true, false, this.prefix);
        } else {
            this.view.nativeElement.value = this._i18n.Get(this.i18n || this.view.nativeElement.value || value, null, true, false, this.prefix);
        }
        this.view.nativeElement.removeAttribute('xi18n');
    }

}
