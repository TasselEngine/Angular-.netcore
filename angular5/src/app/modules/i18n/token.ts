import { InjectionToken } from '@angular/core';

export interface WSi18N {
    locale: string;
    current: { [propName: string]: any; };
    files: { [propName: string]: any; };
}
