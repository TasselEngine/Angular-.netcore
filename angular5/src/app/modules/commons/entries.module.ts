import { CommentEditorModule } from './commentEditor/comt-editor.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommentEditorComponent } from './commentEditor/comt-editor.component';

@NgModule({
    entryComponents: [
        CommentEditorComponent
    ],
    exports: [
        CommentEditorModule,
    ],
})
export class CommonEntryModule { }
