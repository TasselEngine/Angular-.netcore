import { Router } from '@angular/router';
import { TasselAdminCompBase } from './../../../shared/components/base.component';
import { Component, HostBinding, OnInit } from '@angular/core';
import { AdminService, IdentityService } from '../../../../services/app.service';
import { User } from '../../../../model/app.model';
import { Logger } from 'ws-logger';

type UserRole = 'user' | 'admin' | 'core';

@Component({
    selector: 'tassel-admin-usertable',
    templateUrl: './usertable.html',
    styleUrls: [
        './usertable.scss'
    ]
})
export class AdminUserTableComponent extends TasselAdminCompBase implements OnInit {

    private users: User[];
    private admins: User[];
    private cores: User[];
    public loaded = {
        users: false,
        admins: false,
        cores: false
    };

    public get AdminUsers() { return this.admins || []; }
    public get CoreUsers() { return this.cores || []; }
    public get CommonUsers() { return this.users || []; }

    public get IsWideScreen() { return window.innerWidth > 768; }

    public get RouteLinks() { return this.navigator.RouteLinks; }

    private logger: Logger<AdminUserTableComponent>;

    constructor(protected router: Router) {
        super(router);
        this.setI18nPrefix('admin');
        this.logger = this.logsrv.GetLogger('AdminUserTableComponent').SetModule('Admin');
    }

    ngOnInit(): void {
        this.loadUserList();
    }

    private loadUserList() {
        this.admin.GetAllCommonUserAsync().then(([succeed, code, error, users]) => {
            if (succeed && code === 0) { this.users = users; }
            this.loaded.users = true;
        });
        this.admin.GetAllAdminAsync().then(([succeed, code, error, users]) => {
            if (succeed && code === 0) { this.admins = users; }
            this.loaded.admins = true;
        });
        this.admin.GetAllCoreUserAsync().then(([succeed, code, error, users]) => {
            if (succeed && code === 0) { this.cores = users; }
            this.loaded.cores = true;
        });
    }

    public ChangeUserRole(user: User, roleToUpdate: UserRole) {
        const oldType: UserRole = <UserRole>user.Role;
        const oldColl = oldType === 'user' ? this.users : oldType === 'admin' ? this.admins : this.cores;
        if (roleToUpdate !== 'core') {
            this.dismissOrAppoint(roleToUpdate, user, () => {
                if (oldType === 'user') {
                    this.users = this.users.filter(i => i.UUID !== user.UUID);
                    this.admins = [...this.admins, user];
                } else {
                    this.admins = this.admins.filter(i => i.UUID !== user.UUID);
                    this.users = [...this.users, user];
                }
            });
        } else {
            // TO DO
        }
    }


    private async dismissOrAppoint(roleToUpdate: string, user: User, onSuccess: () => void) {
        let action: () => Promise<[boolean, number, any, null]>;
        if (roleToUpdate === 'admin') {
            action = () => this.admin.AppointOrDismissAsync(user.UUID, true);
        } else if (roleToUpdate === 'user') {
            action = () => this.admin.AppointOrDismissAsync(user.UUID, false);
        }
        const [succeed, code, error, _] = await action();
        if (!succeed) {
            this.notify.ErrorToast(this.translate('Update user role failed'), 'Server errors.');
            this.logger.Error([this.translate('Update user role failed'), 'see in details', error], 'dismissOrAppoint');
            return;
        }
        if (code === 0) {
            this.notify.SucceesMessage(this.translate('Update user role successfully'));
            this.logger.Debug([this.translate('Update user role successfully')], 'dismissOrAppoint');
            user.ChangeRole(roleToUpdate);
            onSuccess();
        } else {
            this.notify.WarnToast(this.translate('Update user role failed'), error.msg);
            this.logger.Warn([this.translate('Update user role failed'), error.msg], 'dismissOrAppoint');
        }
    }
}
