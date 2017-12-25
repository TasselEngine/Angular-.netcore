import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { ExtensionsModule } from './../../extensions/extensions.module';
import { NgModule } from '@angular/core';
import { ImageUploadListComponent } from './img_uplist.component';

@NgModule({
    declarations: [
        ImageUploadListComponent,
    ],
    imports: [
        CommonModule,
        ExtensionsModule,
        NgZorroAntdModule
    ],
    providers: [],
    exports: [
        ImageUploadListComponent
    ],
})
export class ImageUpListModule { }
