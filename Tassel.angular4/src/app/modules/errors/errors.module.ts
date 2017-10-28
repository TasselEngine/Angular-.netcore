import { ForbiddenComponent } from './components/401.component';
import { NotFoundComponent } from './components/404.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExtensionsModule } from './../extensions/extensions.module';
import { NgModule } from '@angular/core';

const overRoutes: Routes = [
    {
        path: '', children: [
            { path: '404', component: NotFoundComponent },
            { path: '401', component: ForbiddenComponent },
            { path: '**', redirectTo: '/errors/404', pathMatch: 'full' }
        ]
    }
];

@NgModule({
    declarations: [
        NotFoundComponent,
        ForbiddenComponent
    ],
    imports: [
        CommonModule,
        ExtensionsModule,
        NgZorroAntdModule,
        RouterModule.forChild(overRoutes)
    ],
    providers: [],
    exports: [
        NotFoundComponent,
        ForbiddenComponent
    ]
})
export class ErrorsModule { }
