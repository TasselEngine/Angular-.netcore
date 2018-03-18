import { Directive, ElementRef, Input, HostListener, HostBinding, OnInit } from '@angular/core';
import { FormatService } from '../../../services/app.service';

@Directive({ selector: '[wsAvatar]' })
export class TasselAvatarSrcDirective implements OnInit {

    @HostBinding("src")
    @Input() wsAvatar: string;

    constructor(el: ElementRef, private formater: FormatService) { }

    ngOnInit(): void {
        this.wsAvatar = this.formater.ImageConnect(this.wsAvatar);
    }

}
