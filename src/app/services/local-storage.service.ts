import { Tile } from './../components/game/models/tile';
import { Injectable } from '@angular/core';

export interface IState {
    isTheEnd: boolean;
    tiles: Tile[];
    score: number;
}

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {
    bestScore: number = 0;

    constructor() {
        this.bestScore = this.getBestScore();
    }

    getBestScore(): number {
        return parseInt(localStorage.getItem('bestScore')) || 0;
    }

    updateBestScore(score: number): void {
        let currentScore: number = this.getBestScore();

        if (score > currentScore) {
            this.bestScore = score;
            localStorage.setItem('bestScore', score.toString());
        }
    }

    getState(): IState | null {
        return JSON.parse(localStorage.getItem('state'));
    }

    saveState(tiles: Tile[], isTheEnd: boolean = false, score: number): void {
        const state: IState = {
            isTheEnd,
            tiles,
            score,
        };

        localStorage.setItem('state', JSON.stringify(state));
    }

    clearState(): void {
        localStorage.setItem('state', null);
    }
}
