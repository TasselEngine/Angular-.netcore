/**The return type of Matches(...), an object of javascript used like dictionary. */
type MapResult = { [key: string]: string } | { [key: number]: string };

/**
 * Regular expression types, such as 'i', 'g', 'm'...
 *
 * @export
 * @enum {number}
 */
export enum RegexType {
    Default = '',
    IgnoreCase = 'i',
    Glocal = 'g',
    Multiline = 'm'
}

/**
 * A regular expression extensions for Typescript, provides the names key value pairs supports.
 *
 * @export
 * @class Regex
 */
export class Regex {

    private is_string: boolean;
    private default_key = '__default';

    private _types: string;
    private _typeStrings: string[];
    /**
     * Get the types string connected by ' | '
     *
     * @readonly
     * @type {string}
     * @memberof Regex
     */
    public get Type(): string { return this._typeStrings.join(' | '); }
    /**
     * Get regex types string collection
     *
     * @readonly
     * @type {string[]}
     * @memberof Regex
     */
    public get Types(): string[] { return this._typeStrings; }

    private _pattern: RegExp;
    /**
     * Get the regex pattern of this Regex instance in string format
     *
     * @readonly
     * @type {string}
     * @memberof Regex
     */
    public get Pattern(): string { return this._pattern.toString(); }

    private _keys: string[];
    /**
     * The keys for names pairs return
     *
     * @memberof Regex
     */
    public get Keys() { return this._keys || []; }
    public set Keys(value: string[]) { this._keys = value; }

    /**
     * Create a regex by string of RegExp interface value, support regex types importing.
     *
     * @static
     * @memberof Regex
     */
    public static Create = (pattern: string | RegExp, ...types: RegexType[]) => new Regex(pattern, ...types);

    constructor(pattern: string | RegExp, ...types: RegexType[]) {
        if (pattern instanceof RegExp) {
            this.is_string = false;
            this._pattern = pattern;
            const patStr = pattern.toString();
            this._types = patStr.substring((patStr.lastIndexOf('/') || 0) + 1);
            this._typeStrings = regexTypeReader(this._types);
        } else {
            this.is_string = true;
            this._pattern = new RegExp(pattern, ...types);
            this._types = types.join('');
            this._typeStrings = regexTypeReader(types || [RegexType.Default]);
        }
    }

    /**
     * Set keys of names pairs return
     *
     * @memberof Regex
     */
    public SetKeys = (...keys: string[]): Regex => {
        this._keys = keys;
        return this;
    }

    /**
     * Return a strings collection of matched items
     *
     * @memberof Regex
     */
    public Exec = (target: string): string[] => {
        return this._pattern.exec(target) as string[];
    }

    /**
     * Return a map of matched items in key-value pairs if you've set the names keys, or you can set them here in string[] style.
     *
     * @memberof Regex
     */
    public Matches = (target: string, keys?: string[]): MapResult => {
        const result = this.Exec(target);
        if (this._keys || keys) {
            const coll: { [key: string]: string } = {};
            coll[this.default_key] = (result || [undefined])[0];
            (this._keys || keys).forEach((value, index) => {
                coll[value] = result[index + 1];
            });
            return coll;
        } else {
            const coll: { [key: number]: string } = {};
            result.forEach((value, index) => {
                coll[index] = value;
            });
            return coll;
        }
    }

}

/**Read types to string[] from different type-styles */
const regexTypeReader = (types: string | RegexType[]): string[] => {
    const strs = [] as string[];
    for (const i of types) {
        strs.push(i === RegexType.Default ? 'Default' :
            i === RegexType.IgnoreCase ? 'IgnoreCase' :
                i === RegexType.Multiline ? 'Multiline' :
                    'Global');
    }
    return strs;
};


