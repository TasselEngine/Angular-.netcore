import { StatusDetailsComponent } from './details/details.component';
import { Routes, RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { StatusIndexComponent } from './index/index.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ExtensionsModule } from '../extensions/extensions.module';
import { CommentDivModule } from '../commons/commentDiv/comt-div.module';
import { WaterfallPatchModule } from '../commons/waterfall/waterfall.module';
import { WateriverPatchModule } from '../commons/wateriver/wateriver.module';
import { ImageGridModule } from '../commons/imageGrid/image-grid.module';
import { LikersLineModule } from '../commons/likesLine/likes-line.module';
import { CommentEditorModule } from '../commons/commentEditor/comt-editor.module';
import { CommonLoadingModule } from '../commons/loading/common-loading.module';
import { LikeUserDivModule } from '../commons/likeUserDiv/like-user.module';

const overRoutes: Routes = [
    {
        path: '', children: [
            { path: '', component: StatusIndexComponent },
            { path: ':statusid/details', component: StatusDetailsComponent },
            { path: '**', redirectTo: '/errors/404', pathMatch: 'full' }
        ]
    }
];

@NgModule({
    declarations: [
        StatusIndexComponent,
        StatusDetailsComponent,
    ],
    imports: [
        CommonModule,
        ExtensionsModule,
        FormsModule,
        ReactiveFormsModule,
        WaterfallPatchModule,
        WateriverPatchModule,
        ImageGridModule,
        LikersLineModule,
        LikeUserDivModule,
        CommentDivModule,
        NgZorroAntdModule,
        CommonLoadingModule,
        RouterModule.forChild(overRoutes)
    ],
    providers: [],
    exports: [
        StatusIndexComponent,
        StatusDetailsComponent
    ]
})
export class StatusModule { }
