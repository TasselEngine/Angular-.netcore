import { ImageGridModule } from './imageGrid/image-grid.module';
import { WaterfallPatchModule } from './waterfall/waterfall.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
    exports: [
        WaterfallPatchModule,
        ImageGridModule,
    ],
})
export class CommonBaseModule { }
