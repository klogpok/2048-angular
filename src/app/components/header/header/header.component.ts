import { Component, OnInit } from '@angular/core';
import { GameService } from '../../game/services/game.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    constructor(public gs: GameService) {}

    ngOnInit(): void {}
}
