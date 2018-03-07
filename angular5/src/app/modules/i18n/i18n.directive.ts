import { Directive, Input, ViewContainerRef, ElementRef, OnInit } from '@angular/core';
import { I18N } from './i18n.service';

// tslint:disable-next-line:directive-selector
@Directive({ selector: '[xi18n]' })
export class WSi18nDirective implements OnInit {

    @Input('xi18n') i18n: string;

    @Input() type: 'value' | 'inner' = 'inner';

    constructor(private view: ElementRef, private _i18n: I18N) {

    }

    ngOnInit(): void {
        const [value, id] = (this.i18n || '').split('@@');
        const seleValue = id && this._i18n.Locale[id];
        if (this.type === 'inner') {
            this.view.nativeElement.innerText = seleValue || this._i18n.Get(this.view.nativeElement.innerText || value);
        } else {
            this.view.nativeElement.value = seleValue || this._i18n.Get(this.view.nativeElement.value || value);
        }
        if (id) {
            this.view.nativeElement.id = id;
        }
        this.view.nativeElement.removeAttribute('xi18n');
    }

}
