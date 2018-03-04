import { Component, OnInit, OnChanges, SimpleChanges, ContentChild, AfterContentInit, OnDestroy, Input, HostBinding } from '@angular/core';
import { PreLoadingImageDirective, PreImageTemplateDirective } from './pre.directive';
import { Subscription } from 'rxjs/Subscription';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'ws-pre-image',
    templateUrl: './pre-image.html',
    styleUrls: ['./pre.scss']
})
export class PreloadingImageComponent implements OnInit, OnDestroy, OnChanges, AfterContentInit {

    @Input('stroke')
    private lineWidth: number;
    public get Stroke() { return (this.lineWidth || 0) + 'px'; }

    @ContentChild(PreLoadingImageDirective)
    private image: PreLoadingImageDirective;

    @ContentChild(PreImageTemplateDirective)
    private temp: PreImageTemplateDirective;

    public get ImageWidth() { return this.image && this.image.StyleWidth; }
    public get ImageHeight() { return this.image && this.image.StyleHeight; }

    public showImage = false;
    public hasTemp = false;
    private loadSubp: Subscription;

    ngOnInit(): void {
        this.hasTemp = !!this.temp;
        if (!this.image) { return; }
        this.loadSubp = this.image.OnLoaded.subscribe(param => {
            this.showImage = true;
        });
    }

    ngAfterContentInit(): void {

    }

    ngOnDestroy(): void {
        if (this.loadSubp && !this.loadSubp.closed) {
            this.loadSubp.unsubscribe();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {

    }

}
