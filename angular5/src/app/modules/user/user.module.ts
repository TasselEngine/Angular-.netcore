import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { ExtensionsModule } from './../extensions/extensions.module';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { LoginComponent } from './root/login/login.component';
import { RegisterComponent } from './root/register/register.component';
import { CommonLoadingModule } from '../commons/loading/common-loading.module';

const overRoutes: Routes = [
    {
        path: '', children: [
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: ':uname', loadChildren: './personal/user_personal.module#UserPersonalModule' },
            { path: '**', redirectTo: '/errors/404', pathMatch: 'full' }
        ]
    }
];

@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent
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
        LoginComponent,
        RegisterComponent
    ]
})
export class UserModule { }
