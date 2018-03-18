import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LikeUserDivComponent } from './like-user.component';
import { ExtensionsModule } from '../../extensions/extensions.module';

@NgModule({
    declarations: [
        LikeUserDivComponent
    ],
    imports: [
        CommonModule,
        ExtensionsModule
    ],
    providers: [],
    exports: [
        LikeUserDivComponent
    ],
})
export class LikeUserDivModule { }
