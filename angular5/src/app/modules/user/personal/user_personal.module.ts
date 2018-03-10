import { UserRedirectComponent } from './redirect/redirect.component';
import { ProfileComponent } from './profile/profile.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { ExtensionsModule } from './../../extensions/extensions.module';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonLoadingModule } from '../../commons/loading/common-loading.module';
import { MessageBoxComponent } from './msgBox/msg-box.component';

const overRoutes: Routes = [
    {
        path: '', children: [
            { path: 'redirect', component: UserRedirectComponent },
            { path: 'profile', component: ProfileComponent },
            { path: 'message', component: MessageBoxComponent },
            { path: '', redirectTo: 'profile', pathMatch: 'full' },
            { path: '**', redirectTo: '/errors/404', pathMatch: 'full' }
        ]
    }
];

@NgModule({
    declarations: [
        ProfileComponent,
        UserRedirectComponent,
        MessageBoxComponent
    ],
    imports: [
        CommonModule,
        ExtensionsModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        CommonLoadingModule,
        RouterModule.forChild(overRoutes)
    ],
    providers: [],
    exports: [
        ProfileComponent,
        UserRedirectComponent,
        MessageBoxComponent
    ]
})
export class UserPersonalModule { }
