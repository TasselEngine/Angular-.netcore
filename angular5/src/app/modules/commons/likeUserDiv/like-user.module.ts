import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LikeUserDivComponent } from './like-user.component';

@NgModule({
    declarations: [
        LikeUserDivComponent
    ],
    imports: [
        CommonModule,
    ],
    providers: [],
    exports: [
        LikeUserDivComponent
    ],
})
export class LikeUserDivModule { }
