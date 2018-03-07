import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { WSi18N } from './token';
import { YamlHelper } from '../../utils/app.utils';
import { I18N } from './i18n.service';
import { WSi18nPipe } from './i18n.pipe';
import { WSi18nDirective } from './i18n.directive';
export { WSi18N, I18N };

declare function require(path: string): any;

const i18nFiles = {
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

@NgModule({
    declarations: [WSi18nPipe, WSi18nDirective],
    exports: [WSi18nPipe, WSi18nDirective]
})
export class WSi18nModule {

    public static forRoot(key = 'locale'): ModuleWithProviders {
        const locale = findLocale('locale', 'en-US');
        const newFile = i18nFiles.files[locale];
        i18nFiles.current = newFile || i18nFiles.files['en-US'];
        i18nFiles.locale = newFile ? locale : 'en-US';
        return {
            ngModule: WSi18nModule,
            providers: [
                { provide: I18N, useValue: new I18N(i18nFiles) }
            ]
        };
    }

}
