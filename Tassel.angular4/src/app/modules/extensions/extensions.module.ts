import { JsonPipe } from './pipes/json.pipe';
import { PaddingDirective } from './directives/padding.directive';
import { FullContentDirective } from './directives/fullcontent.directive';
import { FormatPipe } from './pipes/format.pipe';
import { NgModule } from '@angular/core';
@NgModule({
    declarations: [
        FormatPipe,
        FullContentDirective,
        PaddingDirective,
        JsonPipe
    ],
    imports: [],
    providers: [],
    exports: [
        FormatPipe,
        FullContentDirective,
        PaddingDirective,
        JsonPipe
    ],
})
export class ExtensionsModule { }
