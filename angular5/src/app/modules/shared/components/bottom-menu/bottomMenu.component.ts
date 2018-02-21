import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { TasselNavigationBase } from '../base.component';
import { Router } from '@angular/router';
import { IdentityService } from '../../../../services/app.service';
import { IBottomPopConfig, IBottomPopItem } from '../../../../model/app.model';

@Component({
    selector: 'tassel-bottom-menu',
    templateUrl: './bottomMenu.html',
    styleUrls: ['./bottomMenu.scss']
})
export class BottomMenuComponent extends TasselNavigationBase implements OnInit, OnChanges {

    @Input()
    private config: IBottomPopConfig;
    public get Model() { return this.config || { items: [] }; }

    @Output()
    OnMenuClosed = new EventEmitter<any>();

    private showPop: boolean;
    public get ShowPop() { return this.showPop || false; }

    public Disposed = true;

    constructor(protected identity: IdentityService, protected router: Router) {
        super(identity, router);
    }

    ngOnInit(): void {
        this.showPop = false;
    }

    ngOnChanges(changes: SimpleChanges): void {
        for (const propName in changes) {
            if (propName === 'config' && changes[propName].currentValue) {
                this.Disposed = false;
                setTimeout(() => this.showPop = true, 20);
            }
        }
    }

    public CloseThis() {
        this.showPop = false;
        this.OnMenuClosed.emit(new Date());
        setTimeout(() => this.Disposed = true, 350);
    }

    public OnItemClicked(item: IBottomPopItem) {
        if (item.onClick) {
            item.onClick();
        }
        if (!item.lazyClose) {
            this.CloseThis();
        }
    }

}
