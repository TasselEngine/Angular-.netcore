import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'shortline' })
export class ShortLinePipe implements PipeTransform {
    transform(value: any, cap?: number) {
        if (typeof (value) !== 'string') { return value; }
        const length = value.length;
        return !cap ?
            length < 20 ?
                value :
                value.substr(0, 20) + '...' :
            length < cap ?
                value :
                value.substr(0, cap) + '...';
    }
}
