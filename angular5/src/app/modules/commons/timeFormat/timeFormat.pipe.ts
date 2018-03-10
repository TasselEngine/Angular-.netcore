import { PipeTransform, Pipe } from '@angular/core';
import { FormatTime } from 'ws-format-time';
import { I18N } from '../../i18n/i18n.module';

let Month: string;
let Months: string;
let Week: string;
let Weeks: string;
let Day: string;
let Days: string;
let Hour: string;
let Hours: string;
let Minute: string;
let Minutes: string;
let JustNow: string;
let Ago: string;

@Pipe({ name: 'timeFormat' })
export class TimeFormatPipe implements PipeTransform {

    constructor(private i18n: I18N) {
        Month = i18n.Locale.time.month;
        Months = i18n.Locale.time.months || Month;
        Week = i18n.Locale.time.week;
        Weeks = i18n.Locale.time.weeks || Week;
        Day = i18n.Locale.time.day;
        Days = i18n.Locale.time.days || Day;
        Hour = i18n.Locale.time.hour;
        Hours = i18n.Locale.time.hours || Hour;
        Minute = i18n.Locale.time.minute;
        Minutes = i18n.Locale.time.minutes || Minute;
        JustNow = i18n.Locale.time.just_now;
        Ago = i18n.Locale.time.ago;
    }

    transform(value: FormatTime) {
        return TimeFormat(value);
    }
}

function TimeFormat(time: FormatTime) {
    const seconds = Math.floor((Date.now() - time.UnixTime) / 1000);
    if (seconds > 315361000) {
        return time.FormatDateTime;
    } else if (seconds > 25921000) {
        const months = Math.floor(seconds / 2592000);
        return `${months} ${months > 1 ? Months : Month}${Ago}`;
    } else if (seconds > 604800) {
        const weeks = Math.floor(seconds / 604800);
        return `${weeks} ${weeks > 1 ? Weeks : Week}${Ago}`;
    } else if (seconds > 86400) {
        const days = Math.floor(seconds / 86400);
        return `${days} ${days > 1 ? Days : Day}${Ago}`;
    } else if (seconds > 3600) {
        const hours = Math.floor(seconds / 3600);
        return `${hours} ${hours > 1 ? Hours : Hour}${Ago}`;
    } else if (seconds > 60) {
        let mnts = Math.floor(seconds / 60);
        mnts = mnts < 5 ? 1 : Math.floor(mnts / 5) * 5;
        return `${mnts} ${mnts > 1 ? Minutes : Minute}${Ago}`;
    } else {
        return JustNow;
    }
}
