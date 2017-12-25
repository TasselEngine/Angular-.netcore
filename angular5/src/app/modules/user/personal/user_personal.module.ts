import { UserRedirectComponent } from './redirect/redirect.component';
import { ProfileComponent } from './profile/profile.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { ExtensionsModule } from './../../extensions/extensions.module';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

const overRoutes: Routes = [
    {
        path: '', children: [
            { path: 'redirect', component: UserRedirectComponent },
            { path: 'profile', component: ProfileComponent },
            { path: '', redirectTo: 'profile', pathMatch: 'full' },
            { path: '**', redirectTo: '/errors/404', pathMatch: 'full' }
        ]
    }
];

@NgModule({
    declarations: [
        ProfileComponent,
        UserRedirectComponent
    ],
    imports: [
        CommonModule,
        ExtensionsModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        RouterModule.forChild(overRoutes)
    ],
    providers: [],
    exports: [
        ProfileComponent,
        UserRedirectComponent
    ]
})
export class UserPersonalModule { }
