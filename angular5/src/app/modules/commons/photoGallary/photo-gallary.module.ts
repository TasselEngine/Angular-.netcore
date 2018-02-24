import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PhotoGallaryComponent } from './garraly.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonLoadingModule } from '../loading/common-loading.module';

@NgModule({
    declarations: [
        PhotoGallaryComponent
    ],
    imports: [
        CommonModule,
        CommonLoadingModule
    ],
    providers: [],
    exports: [
        PhotoGallaryComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PhotoGallaryModule { }
