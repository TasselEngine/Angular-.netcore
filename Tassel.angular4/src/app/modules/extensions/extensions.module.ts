import { PaddingDirective } from './directives/padding.directive';
import { FullContentDirective } from './directives/fullcontent.directive';
import { FormatPipe } from './pipes/format.pipe';
import { NgModule } from '@angular/core';
@NgModule({
    declarations: [
        FormatPipe,
        FullContentDirective,
        PaddingDirective
    ],
    imports: [],
    providers: [],
    exports: [
        FormatPipe,
        FullContentDirective,
        PaddingDirective
    ],
})
export class ExtensionsModule { }
