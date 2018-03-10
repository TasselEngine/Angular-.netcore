import { WSi18N } from './token';

export class I18N {

    private cache = {};

    constructor(private i18n: WSi18N) { }

    public ResetI18N(locale: string): boolean {
        if (this.i18n.files[locale]) {
            this.i18n.current = <any>this.i18n.files[locale];
            this.i18n.locale = locale;
            this.cache = {};
            return true;
        }
        return false;
    }

    public get Language() { return this.i18n.locale; }

    public get Locale() { return this.i18n.current; }

    public CheckIdName(input: string, checkId = true): [string, string] {
        let value: string;
        let id: string;
        if (checkId) {
            [value, id] = (input || '').split('@@');
        } else {
            value = input;
        }
        return [value, id];
    }

    private findKeyByValue(file: any, value: string) {
        return Object.keys(file).find(key => file[key] === value);
    }

    // value@@id ;  @@id ; value
    public Get(input: string, iid?: string, isSearch = true, checkId = true, prefix = null) {
        let locale = this.Locale;
        let cache = this.cache;
        if (prefix) {
            locale = this.Locale[prefix];
            if (!locale) { return input; }
            if (!this.cache[prefix]) { this.cache[prefix] = {}; }
            cache = this.cache[prefix];
        }
        if (cache[input]) {
            return cache[input];
        }
        let [value, id] = [undefined, undefined];
        if (checkId) {
            if (!iid) {
                [value, id] = this.CheckIdName(input, true);
                if (id) {
                    return cache[input] = cache[id] = locale[id] || value || input;
                }
            } else {
                [value, id] = [input, iid];
                return cache[id] = locale[id] || value;
            }
        } else {
            value = input;
        }
        if (value) {
            let real: any;
            for (const prop in this.i18n.files) {
                if (prop) {
                    const source = this.i18n.files[prop];
                    if (!source) { continue; }
                    const file = !!prefix ? source[prefix] : source;
                    if (!file) { continue; }
                    const key = this.findKeyByValue(file, value);
                    if (key) {
                        real = locale[key] || value;
                        cache[input] = cache[key] = real;
                        break;
                    }
                }
            }
            return real || value;
        }
        return input;
    }

}
