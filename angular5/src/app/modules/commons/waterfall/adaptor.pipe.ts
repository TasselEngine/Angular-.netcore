import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'tasselAdaptor' })
export class AdaptorPipe implements PipeTransform {
    transform(value: number, level: number) {
        return calculate(value, level);
    }

}

const calculate = (value: number, level: number) => {
    return level > value ? 0 : 24 / value;
};
