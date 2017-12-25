import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TinyMCEEditorComponent } from './tinymce.component';

@NgModule({
    declarations: [
        TinyMCEEditorComponent
    ],
    imports: [
        CommonModule,
    ],
    providers: [],
    exports: [
        TinyMCEEditorComponent
    ],
})
export class TinyMCEModule { }
