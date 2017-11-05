import { AnimationEntryMetadata, state } from '@angular/core';
import { trigger, transition, animate, style, query, group } from '@angular/animations';

export const pageShowAnimation: AnimationEntryMetadata =
    trigger('routeAnimation', [
        transition(':enter', [
            style({
                opacity: 0.5,
            }),
            animate('1.2s ease-in-out', style({ opacity: 1 }))
        ]),
        transition(':leave', [
            style({
                opacity: 0,
            }),
            animate('0.0s ease-in-out')
        ])
    ]);
