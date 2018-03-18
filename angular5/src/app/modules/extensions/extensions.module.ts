import { ShortLinePipe } from './pipes/shortline.pipe';
import { JsonPipe } from './pipes/json.pipe';
import { PaddingDirective } from './directives/padding.directive';
import { FullContentDirective } from './directives/fullcontent.directive';
import { FormatPipe } from './pipes/format.pipe';
import { NgModule } from '@angular/core';
import { TasselAvatarSrcDirective } from './directives/user-avatar.directive';
@NgModule({
    declarations: [
        FormatPipe,
        FullContentDirective,
        TasselAvatarSrcDirective,
        PaddingDirective,
        JsonPipe,
        ShortLinePipe
    ],
    imports: [],
    providers: [],
    exports: [
        FormatPipe,
        FullContentDirective,
        TasselAvatarSrcDirective,
        PaddingDirective,
        JsonPipe,
        ShortLinePipe
    ],
})
export class ExtensionsModule { }
