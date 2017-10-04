import { AdaptorPipe } from './pipes/adaptor.pipe';
import { PaddingDirective } from './directives/padding.directive';
import { FullContentDirective } from './directives/fullcontent.directive';
import { FormatPipe } from './pipes/format.pipe';
import { NgModule } from '@angular/core';
@NgModule({
    declarations: [
        FormatPipe,
        FullContentDirective,
        PaddingDirective,
        AdaptorPipe
    ],
    imports: [],
    providers: [],
    exports: [
        FormatPipe,
        FullContentDirective,
        PaddingDirective,
        AdaptorPipe
    ],
})
export class ExtensionsModule { }
