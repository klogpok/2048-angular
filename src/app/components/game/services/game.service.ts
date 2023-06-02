import { Injectable } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Tile } from '../models/tile';

@Injectable({
    providedIn: 'root',
})
export class GameService {
    tiles: Tile[] = [];
    score: number = 0;
    theEnd: boolean = true;

    private boardSize: number = 4;
    private availableCells: number[] = [];

    private get emptyCells(): number[] {
        const notEmptyCells = this.notEmptyCells;

        return this.availableCells.filter(
            (cell) => !notEmptyCells.includes(cell)
        );
    }

    private get notEmptyCells(): number[] {
        return this.tiles.map((tile) => tile.row * 10 + tile.col);
    }

    constructor(private ls: LocalStorageService) {
        this.initNewGame();
    }

    initNewGame(): void {
        this.availableCells = [];
        this.tiles = [];
        this.score = 0;
        this.theEnd = false;
        this.generateAvailableCells();
        this.generateTiles();
    }

    right(): void {
        this.move('row', 'col', true);
    }

    left(): void {
        this.move('row', 'col');
    }

    up(): void {
        this.move('col', 'row');
    }

    down(): void {
        this.move('col', 'row', true);
    }

    private move(
        dimX: 'row' | 'col' = 'row',
        dimY: 'row' | 'col' = 'col',
        reverse = false
    ): void {
        if (this.theEnd || !this.canIMove(dimX, false, reverse)) {
            return;
        }

        this.clearDeletesTiles();

        const mergedTiles: Tile[] = [];

        for (let x = 1; x <= this.boardSize; x++) {
            const tiles: Tile[] = this.tiles
                .filter((tile) => tile[dimX] === x)
                .sort((a, b) => a[dimY] - b[dimY]);

            if (reverse) {
                tiles.reverse();
            }

            let y = reverse ? this.boardSize : 1;
            let merged = false;
            let prevTile: Tile = null;

            for (const tile of tiles) {
                if (prevTile) {
                    if (merged) {
                        merged = false;
                    } else if (tile.value === prevTile.value) {
                        reverse ? y++ : y--;
                        prevTile.isOnDelete = true;
                        tile.isOnDelete = true;

                        mergedTiles.push({
                            value: tile.value * 2,
                            [dimX]: x,
                            [dimY]: y,
                            isMerged: true,
                        } as unknown as Tile);

                        merged = true;
                        this.score = this.score + tile.value * 2;
                        this.ls.updateBestScore(this.score);
                    }
                }

                tile[dimY] = y;
                reverse ? y-- : y++;
                prevTile = tile;
            }
        }

        this.tiles = [...this.tiles, ...mergedTiles];

        setTimeout(() => {
            this.generateTiles(1);

            if (this.isTheEnd()) {
                setTimeout(() => {
                    this.theEnd = true;
                    this.ls.saveState(
                        this.tiles.filter((tile) => !tile.isOnDelete),
                        true
                    );
                }, 1000);
            }

            this.ls.saveState(this.tiles.filter((tile) => !tile.isOnDelete));
        }, 100);
    }

    private isTheEnd(): boolean {
        return !this.canIMove('row') && !this.canIMove('col');
    }

    private canIMove(dimX: 'row' | 'col', skipDir = true, forward = false) {
        const dimY = dimX === 'row' ? 'col' : 'row';

        for (let i = 1; i <= this.boardSize; i++) {
            const tilesIn = this.tiles
                .filter((tile) => !tile.isOnDelete && tile[dimX] === i)
                .sort((a, b) => a[dimY] - b[dimY]);

            if (tilesIn.length !== this.boardSize) {
                if (skipDir) {
                    return true;
                }

                const length = tilesIn.length;
                const lockedPositons: number[] = [];
                const start = forward ? this.boardSize + 1 - length : 1;
                const end = forward ? this.boardSize : length;

                for (let y = start; y <= end; y++) {
                    lockedPositons.push(y);
                }

                if (
                    tilesIn.find((tile) => !lockedPositons.includes(tile[dimY]))
                ) {
                    return true;
                }
            }

            let prevValue = 0;

            for (const tile of tilesIn) {
                if (tile.value === prevValue) {
                    return true;
                }

                prevValue = tile.value;
            }
        }

        return false;
    }

    private clearDeletesTiles(): void {
        this.tiles = this.tiles.filter((tile) => !tile.isOnDelete);
    }

    /**
     * Generates new tiles for the game.
     * @param length The number of tiles to generate.
     */
    private generateTiles(length = 2): void {
        // Make sure length is a valid number.
        if (typeof length !== 'number' || length < 1) {
            throw new Error('Length must be a number greater than 0');
        }

        // Get a random selection of empty cell positions
        const availableTilesPositions: number[] = this.emptyCells
            .sort(() => Math.random() - 0.5)
            .slice(0, length);

        // Create new tiles with a value of 2 and the selected positions
        this.tiles = [
            ...this.tiles,
            ...availableTilesPositions.map<Tile>((position: number) => ({
                value: 2,
                row: this.getPositionRow(position),
                col: this.getPositionCol(position),
            })),
        ];
    }

    getPositionRow(position: number): number {
        return Math.floor(position / 10);
    }

    getPositionCol(position: number): number {
        return position % 10;
    }

    private generateAvailableCells(): void {
        // Create a 2D array of cell positions.
        const cells = Array.from({ length: this.boardSize }, (_, row) =>
            Array.from(
                { length: this.boardSize },
                (_, col) => (row + 1) * 10 + col + 1
            )
        );

        // Flatten the 2D array into a 1D array of cell positions.
        this.availableCells = cells.flatMap((row) => row);
    }
}
