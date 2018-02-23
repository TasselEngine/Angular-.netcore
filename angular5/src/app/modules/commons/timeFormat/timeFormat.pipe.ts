import { PipeTransform, Pipe } from '@angular/core';
import { FormatTime } from 'ws-format-time';

@Pipe({ name: 'timeFormat' })
export class TimeFormatPipe implements PipeTransform {
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
        return `${months} month${months > 1 ? 's' : ''} ago`;
    } else if (seconds > 604800) {
        const weeks = Math.floor(seconds / 604800);
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (seconds > 86400) {
        const days = Math.floor(seconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (seconds > 3600) {
        const hours = Math.floor(seconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (seconds > 60) {
        let mnts = Math.floor(seconds / 60);
        mnts = mnts < 5 ? 1 : Math.floor(mnts / 5) * 5;
        return `${mnts} minute${mnts > 1 ? 's' : ''} ago`;
    } else {
        return 'just now';
    }
}
