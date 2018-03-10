import { CommentEditorComponent } from './../commentEditor/comt-editor.component';
import { CommentEditorModule } from './../commentEditor/comt-editor.module';
import { CommentDivComponent } from './comt-div.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { ExtensionsModule } from './../../extensions/extensions.module';
import { NgModule } from '@angular/core';
import { WSi18nModule } from '../../i18n/i18n.module';

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
        NgZorroAntdModule,
        WSi18nModule
    ],
    providers: [],
    exports: [
        CommentEditorComponent,
        CommentDivComponent
    ],
})
export class CommentDivModule { }
