import { Component, HostListener, OnInit } from '@angular/core';
import { Tile, TileStyle } from './models/tile';
import { GameService } from './services/game.service';

const colors: Record<number, TileStyle> = {
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

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
    keyEventCodeMap: { [type: string]: string } = {
        ArrowRight: 'right',
        ArrowLeft: 'left',
        ArrowUp: 'up',
        ArrowDown: 'down',
    };

    constructor(public gs: GameService) {}

    ngOnInit() {}

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (this.keyEventCodeMap[event.code]) {
            this.gs[this.keyEventCodeMap[event.code]]();
        }
    }

    getTileStyle(tile: Tile) {
        return {
            top: (tile.row - 1) * 125 + 'px',
            left: (tile.col - 1) * 125 + 'px',
            backgroundColor: colors[tile.value].backgroundColor,
            color: colors[tile.value].color,
        };
    }
}
