import { CommentEditorModule } from './commentEditor/comt-editor.module';
import { CommentDivModule } from './commentDiv/comt-div.module';
import { ImageGridModule } from './imageGrid/image-grid.module';
import { WaterfallPatchModule } from './waterfall/waterfall.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
    exports: [
        WaterfallPatchModule,
        ImageGridModule,
        CommentDivModule,
        CommentEditorModule
    ],
})
export class CommonBaseModule { }
