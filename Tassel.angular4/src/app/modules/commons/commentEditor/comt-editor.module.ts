import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommentEditorComponent } from './comt-editor.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { ExtensionsModule } from './../../extensions/extensions.module';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
        CommentEditorComponent
    ],
    imports: [
        CommonModule,
        ExtensionsModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule
    ],
    providers: [],
    exports: [
        CommentEditorComponent
    ],
})
export class CommentEditorModule { }
