import { Component, HostListener, OnInit } from '@angular/core';
import { Tile, TileStyle } from './models/tile';
import { GameService } from './services/game.service';
import { ColorSchemaService } from 'src/app/services/color-schema.service';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
    colorSchema: Record<number, TileStyle>;

    keyEventCodeMap: { [type: string]: string } = {
        ArrowRight: 'right',
        ArrowLeft: 'left',
        ArrowUp: 'up',
        ArrowDown: 'down',
    };

    constructor(
        public gs: GameService,
        private colorSchemaService: ColorSchemaService
    ) {}

    ngOnInit() {
        this.colorSchema = this.colorSchemaService.getColorSchema();
    }

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
            backgroundColor: this.colorSchema[tile.value].backgroundColor,
            color: this.colorSchema[tile.value].color,
        };
    }
}
