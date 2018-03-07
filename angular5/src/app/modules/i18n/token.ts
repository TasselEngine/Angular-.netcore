import { InjectionToken } from '@angular/core';

export const I18nToken = new InjectionToken<WSi18N>('ws-i18n-token');

export interface WSi18N {
    locale: string;
    current: { [propName: string]: string | number | boolean; };
    files: { [propName: string]: string | number | boolean; };
}

export class I18N {

    constructor(private i18n: WSi18N) { }

    public get Language() { return this.i18n.locale; }

    public get Locale() { return this.i18n.current; }

    public Get(KeyValue: string, isSearch = true) {
        if (this.Locale[KeyValue]) {
            return this.Locale[KeyValue];
        } else {
            let real: any;
            for (const prop in this.i18n.files) {
                if (prop) {
                    const file = this.i18n.files[prop];
                    const target = Object.keys(file).find(key => file[key] === KeyValue);
                    if (target) {
                        real = this.Locale[target] || KeyValue;
                        break;
                    }
                }
            }
            return real || KeyValue;
        }
    }
}
