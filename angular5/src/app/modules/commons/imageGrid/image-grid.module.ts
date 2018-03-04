import { ImageGridComponent } from './image-grid.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { ExtensionsModule } from './../../extensions/extensions.module';
import { NgModule } from '@angular/core';
import { PreloadingImageModule } from '../imagePreload/image-pre.module';

@NgModule({
    declarations: [
        ImageGridComponent
    ],
    imports: [
        CommonModule,
        ExtensionsModule,
        NgZorroAntdModule,
        PreloadingImageModule
    ],
    providers: [],
    exports: [
        ImageGridComponent
    ],
})
export class ImageGridModule { }
