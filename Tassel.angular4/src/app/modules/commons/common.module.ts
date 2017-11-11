import { WateriverPatchModule } from './wateriver/wateriver.module';
import { StickersGroupModule } from './stickersGroup/stickers-group.module';
import { LikersLineModule } from './likesLine/likes-line.module';
import { CommentEditorModule } from './commentEditor/comt-editor.module';
import { CommentDivModule } from './commentDiv/comt-div.module';
import { ImageGridModule } from './imageGrid/image-grid.module';
import { WaterfallPatchModule } from './waterfall/waterfall.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ImageUpListModule } from './imageUploadList/img_upload.module';

@NgModule({
    exports: [
        WaterfallPatchModule,
        WateriverPatchModule,
        ImageGridModule,
        ImageUpListModule,
        CommentDivModule,
        CommentEditorModule,
        StickersGroupModule,
        LikersLineModule
    ],
})
export class CommonBaseModule { }
