import { animate, keyframes, style, transition, trigger } from '@angular/animations';

export function paginationFadeInAnimation(timings: string | number = '0.12s ease-in-out') {
    return trigger('paginationFadeIn', [
        transition(`void => *`, [
            animate(timings, keyframes([
                style({ width: 0, offset: 0 }),
                style({ width: 32, offset: 1 })
            ])),
        ]),
    ]);
}

export function paginationFadeOutAnimation(timings: string | number = '0.12s ease-in-out') {
    return trigger('paginationFadeOut', [
        transition('* => void', [
            animate(timings, keyframes([
                style({ width: 32, offset: 0 }),
                style({ width: 0, offset: 1 })
            ])),
        ]),
    ]);
}
