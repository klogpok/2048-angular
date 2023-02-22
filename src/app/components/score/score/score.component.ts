import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { GameService } from '../../game/services/game.service';

@Component({
    selector: 'app-score',
    templateUrl: './score.component.html',
    styleUrls: ['./score.component.scss'],
})
export class ScoreComponent implements OnInit {
    constructor(public gs: GameService, public ls: LocalStorageService) {}

    ngOnInit(): void {}
}
