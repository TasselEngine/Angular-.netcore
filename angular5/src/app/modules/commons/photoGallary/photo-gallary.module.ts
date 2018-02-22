import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PhotoGallaryComponent } from './garraly.component';

@NgModule({
    declarations: [
        PhotoGallaryComponent
    ],
    imports: [
        CommonModule,
    ],
    providers: [],
    exports: [
        PhotoGallaryComponent
    ],
})
export class PhotoGallaryModule { }
