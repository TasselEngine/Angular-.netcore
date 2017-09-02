import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'tasselFormat' })
export class FormatPipe implements PipeTransform {
    transform(value: any, ...args: any[]) {
        return value;
    }

}
