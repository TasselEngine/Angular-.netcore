
export class UrlGenerator {

    private queries: { [name: string]: number | string | boolean } = {};
    private sections: Array<number | string | boolean> = [];

    constructor(private rootpath: string) { }

    public section(value: string | number | boolean | Array<string | number | boolean>) {
        if (value instanceof Array) {
            this.sections.push(...value);
        } else {
            this.sections.push(value);
        }
        return this;
    }

    public query(name: string, value: number | string | boolean) {
        this.queries[name] = value;
        return this;
    }

    public toString() {
        const queries: string[] = [];
        Object.keys(this.queries).forEach(name => {
            if (this.queries[name] !== null && this.queries[name] !== undefined) {
                queries.push(`${name}=${this.queries[name]}`);
            }
        });
        return `${this.rootpath}${this.sections.length > 0 ? '/' : ''}${this.sections.join('/')}${queries.length > 0 ? '?' : ''}${queries.join('&')}`;
    }

}
