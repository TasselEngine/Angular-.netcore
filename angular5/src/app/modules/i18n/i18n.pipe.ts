import { PipeTransform, Pipe } from '@angular/core';
import { I18N } from './i18n.service';

@Pipe({ name: 'xi18n' })
export class WSi18nPipe implements PipeTransform {

    constructor(private i18n: I18N) { }

    transform(value: string, section?: string, search = true, i18n = this.i18n) {
        if (!i18n) { return value; }
        return i18n.Get(value, null, search, true, section);
    }

}
