import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { I18nToken, WSi18N } from './token';
import { YamlHelper } from '../../utils/app.utils';
export { WSi18N };

declare function require(path: string): any;

const i18nFiles = {
    current: '',
    locale: '',
    files: {
        'en-US': require('./files/en-US.json'),
        'zh-CN': require('./files/zh-CN.json')
    }
};

function findLocale(key: string, def = 'en-US') {
    const objURL = {};
    (window.location.search || '').replace(new RegExp('([^?=&]+)(=([^&]*))?', 'g'), ($0, $1, $2, $3) => objURL[$1] = $3);
    return objURL[key] || def;
}

@NgModule()
export class WSi18nModule {

    public static forRoot(key = 'locale'): ModuleWithProviders {
        const locale = findLocale('locale', 'en-US');
        i18nFiles.current = i18nFiles.files[locale];
        i18nFiles.locale = locale;
        return {
            ngModule: WSi18nModule,
            providers: [{ provide: I18nToken, useValue: i18nFiles }]
        };
    }

}
