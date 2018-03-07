import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { WSi18N } from './token';
import { YamlHelper } from '../../utils/app.utils';
import { I18N } from './i18n.service';
import { WSi18nPipe } from './i18n.pipe';
import { WSi18nDirective } from './i18n.directive';
export { WSi18N, I18N };

declare function require(path: string): any;

export const WSI18N_CONFIG = new InjectionToken<WSi18N>('WSI18N_CONFIG');

const i18nFiles: WSi18N = {
    current: null,
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

function i18nFactory(config: WSi18N) {
    const locale = findLocale(config.locale, 'en-US');
    const newFile = i18nFiles.files[locale];
    i18nFiles.current = newFile || i18nFiles.files['en-US'];
    i18nFiles.locale = newFile ? locale : 'en-US';
    return new I18N(i18nFiles);
}

@NgModule({
    declarations: [WSi18nPipe, WSi18nDirective],
    exports: [WSi18nPipe, WSi18nDirective]
})
export class WSi18nModule {

    public static forRoot(key = 'locale'): ModuleWithProviders {

        return {
            ngModule: WSi18nModule,
            providers: [
                { provide: WSI18N_CONFIG, useValue: { locale: key || 'en-US' } },
                { provide: I18N, useFactory: i18nFactory, deps: [WSI18N_CONFIG] }
            ]
        };
    }

}
