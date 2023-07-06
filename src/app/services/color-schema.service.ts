import { Injectable } from '@angular/core';
import { TileStyle } from '../components/game/models/tile';

@Injectable({
    providedIn: 'root',
})
export class ColorSchemaService {
    colorSchema1: Record<number, TileStyle> = {
        2: {
            backgroundColor: '#eee4da',
            color: '#776e65',
        },
        4: {
            backgroundColor: '#eee1c9',
            color: '#776e65',
        },
        8: {
            backgroundColor: '#f3b27a',
            color: '#f9f6f2',
        },
        16: {
            backgroundColor: '#f69664',
            color: '#f9f6f2',
        },
        32: {
            backgroundColor: '#f77c5f',
            color: '#f9f6f2',
        },
        64: {
            backgroundColor: '#f75f3b',
            color: '#f9f6f2',
        },
        128: {
            backgroundColor: '#edd073',
            color: '#f9f6f2',
        },
        256: {
            backgroundColor: '#edcc62',
            color: '#f9f6f2',
        },
        512: {
            backgroundColor: '#edc950',
            color: '#f9f6f2',
        },
        1024: {
            backgroundColor: '#edc53f',
            color: '#f9f6f2',
        },
        2048: {
            backgroundColor: '#edc22e',
            color: '#f9f6f2',
        },
        4096: {
            backgroundColor: '#edc000',
            color: '#f9f6f2',
        },
        8192: {
            backgroundColor: '##b3930a',
            color: '#7e6e5d',
        },
    };

    colorSchema2: Record<number, TileStyle> = {
        2: {
            backgroundColor: '#D9D2B4',
            color: '#776e65',
        },
        4: {
            backgroundColor: '#EFE2C5',
            color: '#776e65',
        },
        8: {
            backgroundColor: '#F7CBA0',
            color: '#f9f6f2',
        },
        16: {
            backgroundColor: '#F7B977',
            color: '#f9f6f2',
        },
        32: {
            backgroundColor: '#F7A748',
            color: '#f9f6f2',
        },
        64: {
            backgroundColor: '#F78C3F',
            color: '#f9f6f2',
        },
        128: {
            backgroundColor: '#F7DA9D',
            color: '#f9f6f2',
        },
        256: {
            backgroundColor: '#F7D27F',
            color: '#f9f6f2',
        },
        512: {
            backgroundColor: '#F7CB61',
            color: '#f9f6f2',
        },
        1024: {
            backgroundColor: '#F7C443',
            color: '#f9f6f2',
        },
        2048: {
            backgroundColor: '#F7BD25',
            color: '#f9f6f2',
        },
        4096: {
            backgroundColor: '#3E3939',
            color: '#f9f6f2',
        },
        8192: {
            backgroundColor: '##b3930a',
            color: '#7e6e5d',
        },
    };

    getColorSchema(): Record<number, TileStyle> {
        return this.colorSchema1;
    }
}
