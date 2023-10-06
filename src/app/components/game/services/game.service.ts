import { Injectable } from '@angular/core';
import {
    IState,
    LocalStorageService,
} from 'src/app/services/local-storage.service';
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

    constructor(private ls: LocalStorageService) {}

    initGame(isNewGame = false): void {
        const state: IState | null = this.ls.getState();

        if (state && !isNewGame) {
            const localState = this.ls.getState();
            this.score = localState.score;
            this.theEnd = localState.isTheEnd;
            this.tiles = localState.tiles;
            this.generateAvailableCellsByTiles(this.tiles);
        } else {
            this.availableCells = [];
            this.tiles = [];
            this.score = 0;
            this.theEnd = false;
            this.generateAvailableCells();
            this.generateTiles();
            this.ls.clearState();
        }
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

            if (!this.isTheEnd()) {
                this.ls.saveState(
                    this.tiles.filter((tile) => !tile.isOnDelete),
                    false,
                    this.score
                );
            } else {
                setTimeout(() => {
                    this.theEnd = true;
                    this.ls.saveState(
                        this.tiles.filter((tile) => !tile.isOnDelete),
                        true,
                        this.score
                    );
                }, 1000);
            }
        }, 100);
    }

    private isTheEnd(): boolean {
        console.log(!this.canIMove('row'), !this.canIMove('col'));
        return !this.canIMove('row') && !this.canIMove('col');
    }

    private canIMove(dimX: 'row' | 'col', skipDir = true, forward = false) {
        // Determine the other dimension (either row or column) based on the chosen dimension
        const dimY = dimX === 'row' ? 'col' : 'row';

        // Iterate over all rows or columns in the board
        for (let i = 1; i <= this.boardSize; i++) {
            // Filter tiles in the current row or column and sort them based on the other dimension
            const tilesInDimension = this.tiles
                .filter((tile) => !tile.isOnDelete && tile[dimX] === i)
                .sort((a, b) => a[dimY] - b[dimY]);

            // Check for empty positions in the row or column
            if (tilesInDimension.length !== this.boardSize) {
                // If skipping is allowed and there are empty positions, return true
                if (skipDir) {
                    return true;
                }

                // Generate locked positions for the tiles in the row or column
                const length = tilesInDimension.length;
                const lockedPositions = this.generateLockedPositions(
                    length,
                    forward
                );

                // If there is a tile not on a locked position, return true
                if (
                    tilesInDimension.find(
                        (tile) => !lockedPositions.includes(tile[dimY])
                    )
                ) {
                    return true;
                }
            }

            // Check for tiles with duplicate values in the row or column
            if (this.hasDuplicateValues(tilesInDimension)) {
                return true;
            }
        }

        // If there are no immovable tiles and no duplicate values, return false
        return false;
    }

    // Generate locked positions for the tiles in a row or column
    private generateLockedPositions(
        length: number,
        forward: boolean
    ): number[] {
        const lockedPositions: number[] = [];
        const start = forward ? this.boardSize + 1 - length : 1;
        const end = forward ? this.boardSize : length;

        // Generate locked positions from start to end
        for (let y = start; y <= end; y++) {
            lockedPositions.push(y);
        }

        return lockedPositions;
    }

    // Check for tiles with duplicate values
    private hasDuplicateValues(tiles: Tile[]): boolean {
        let prevValue = 0;

        // Iterate over all tiles and check for duplicate values
        for (const tile of tiles) {
            if (tile.value === prevValue) {
                return true;
            }

            prevValue = tile.value;
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

    private generateAvailableCellsByTiles(tiles: Tile[]): void {
        const cells = Array.from({ length: this.boardSize }, (_, row) =>
            Array.from(
                { length: this.boardSize },
                (_, col) => (row + 1) * 10 + col + 1
            )
        );

        const cells2: number[] = tiles.map(
            (tile: Tile) => tile.row * 10 + tile.col
        );

        this.availableCells = cells
            .flatMap((row) => row)
            .filter((item) => !cells2.includes(item));
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
