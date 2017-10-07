import { RegisterComponent } from './components/register.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { LoginComponent } from './components/login.component';
import { CommonModule } from '@angular/common';
import { ExtensionsModule } from './../extensions/extensions.module';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

const overRoutes: Routes = [
    {
        path: '', children: [
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
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
        RouterModule.forChild(overRoutes)
    ],
    providers: [],
    exports: [
        LoginComponent,
        RegisterComponent
    ]
})
export class UserModule { }
