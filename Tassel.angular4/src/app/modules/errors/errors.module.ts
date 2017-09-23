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
            { path: '**', redirectTo: '/errors/404', pathMatch: 'full' }
        ]
    }
];

@NgModule({
    declarations: [
        NotFoundComponent
    ],
    imports: [
        CommonModule,
        ExtensionsModule,
        NgZorroAntdModule,
        RouterModule.forChild(overRoutes)
    ],
    providers: [],
    exports: [
        NotFoundComponent
    ]
})
export class ErrorsModule { }
