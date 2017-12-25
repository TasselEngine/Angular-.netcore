import { CommentEditorComponent } from './../commentEditor/comt-editor.component';
import { CommentEditorModule } from './../commentEditor/comt-editor.module';
import { CommentDivComponent } from './comt-div.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { ExtensionsModule } from './../../extensions/extensions.module';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
        CommentDivComponent
    ],
    entryComponents: [
        CommentEditorComponent
    ],
    imports: [
        CommonModule,
        ExtensionsModule,
        CommentEditorModule,
        NgZorroAntdModule
    ],
    providers: [],
    exports: [
        CommentEditorComponent,
        CommentDivComponent
    ],
})
export class CommentDivModule { }
