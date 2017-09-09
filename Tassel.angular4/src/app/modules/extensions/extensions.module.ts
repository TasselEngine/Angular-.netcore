import { PaddingLRDirective } from './directives/padd_lr.directive';
import { FullContentDirective } from './directives/fullcontent.directive';
import { FormatPipe } from './pipes/format.pipe';
import { NgModule } from '@angular/core';
@NgModule({
    declarations: [
        FormatPipe,
        FullContentDirective,
        PaddingLRDirective
    ],
    imports: [],
    providers: [],
    exports: [
        FormatPipe,
        FullContentDirective,
        PaddingLRDirective
    ],
})
export class ExtensionsModule { }
