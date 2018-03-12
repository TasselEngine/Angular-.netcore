import { StickersGroupModule } from './../stickersGroup/stickers-group.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommentEditorComponent } from './comt-editor.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { ExtensionsModule } from './../../extensions/extensions.module';
import { NgModule } from '@angular/core';
import { WSi18nModule } from '../../i18n/i18n.module';

@NgModule({
    declarations: [
        CommentEditorComponent
    ],
    imports: [
        WSi18nModule,
        CommonModule,
        ExtensionsModule,
        FormsModule,
        ReactiveFormsModule,
        StickersGroupModule,
        NgZorroAntdModule
    ],
    providers: [],
    exports: [
        CommentEditorComponent
    ],
})
export class CommentEditorModule { }
