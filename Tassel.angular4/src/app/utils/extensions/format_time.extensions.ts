import { Regex } from 'ws-regex';

export type TimeZone = number | string;
export type TimeInput = [TimeZone, TimeZone, TimeZone, TimeZone, TimeZone, TimeZone, TimeZone] | Date;

export class FormatTime {

    private time: Date = new Date(1970, 1, 1, 0, 0, 0, 0);

    public get Years() { return this.time.getFullYear(); }
    public get Months() { return this.time.getMonth(); }
    public get Days() { return this.time.getDate(); }
    public get Hours() { return this.time.getHours(); }
    public get Minutes() { return this.time.getMinutes(); }
    public get Seconds() { return this.time.getSeconds(); }
    public get Milliseconds() { return this.time.getMilliseconds(); }

    public get FormatDate() { return `${this.Years}-${this.Months >= 10 ? this.Months : '0' + this.Months}-${this.Days >= 10 ? this.Days : '0' + this.Days}`; }
    public get FormatTime() { return `${this.Hours}:${this.Minutes >= 10 ? this.Minutes : '0' + this.Minutes}:${this.Seconds >= 10 ? this.Seconds : '0' + this.Seconds}`; }
    public get FormatDateTime() { return `${this.FormatDate} ${this.FormatTime}`; }

    public static Create = (param: TimeInput, zone: number = 0) => new FormatTime(param, zone);

    public static Parse = (pattern: string | RegExp, target: string, zone: number = 0, keys: string[] = ['Yr', 'Mth', 'Dy', 'h', 'm', 's', 'ms']) => {
        const coll = Regex.Create(pattern).SetKeys(...keys).Matches(target);
        return new FormatTime([coll[keys[0]], coll[keys[1]], coll[keys[2]], coll[keys[3]], coll[keys[4]], coll[keys[5]], coll[keys[6]]], zone);
    }

    constructor(param: TimeInput, zone: number = 0) {
        if (param instanceof Array) {
            this.time = new Date(...param);
        } else {
            this.time = param;
        }
        if (Math.abs(zone) > 12) {
            zone = 0;
        }
        this.time = new Date(this.time.getTime() + zone * 3600000);
    }

}
