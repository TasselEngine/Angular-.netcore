import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PreloadingImageComponent } from './pre-image.component';

@NgModule({
    declarations: [
        PreloadingImageComponent
    ],
    imports: [
        CommonModule,
    ],
    providers: [],
    exports: [
        PreloadingImageComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PreloadingImageModule { }
