import { AbstractControl, ValidatorFn } from '@angular/forms';


export function RegexExpressionValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const succeed = nameRe.test(control.value);
        return succeed ? null : { 'regexFailed': { value: control.value } };
    };
}

export function EqualValidator(nameRe: any): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const succeed = control.value === nameRe;
        return succeed ? null : { 'equalFailed': { value: control.value, should: nameRe } };
    };
}

