import { InjectionToken } from '@angular/core';

export interface WSi18N {
    locale: string;
    current: { [propName: string]: string | number | boolean; };
    files: { [propName: string]: string | number | boolean; };
}
