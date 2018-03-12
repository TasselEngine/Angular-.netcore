import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'keyDisplay' })
export class KeyDisplayPipe implements PipeTransform {
    transform(value: any) {
        if (!value || typeof (value) !== 'string') { return value; }
        const length = value.length;
        return length <= 3 ? value : value.substring(2, length - 1).replace('sinar', '').replace('sina', '').replace('aru-', '');
    }
}
