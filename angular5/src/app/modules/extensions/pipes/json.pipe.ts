import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'tasselJson' })
export class JsonPipe implements PipeTransform {
    transform(value: any, ...args: any[]) {
        return JSON.stringify(value);
    }

}
