import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PreloadingImageComponent } from './pre.component';
import { PreLoadingImageDirective, PreImageTemplateDirective } from './pre.directive';

@NgModule({
    declarations: [
        PreloadingImageComponent,
        PreLoadingImageDirective,
        PreImageTemplateDirective
    ],
    imports: [
        CommonModule,
    ],
    providers: [],
    exports: [
        PreloadingImageComponent,
        PreLoadingImageDirective,
        PreImageTemplateDirective
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PreloadingImageModule { }
