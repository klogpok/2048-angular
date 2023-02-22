import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameModule } from './modules/game/game.module';
import { ScoreComponent } from './components/score/score/score.component';
import { HeaderComponent } from './components/header/header/header.component';

@NgModule({
    declarations: [AppComponent, ScoreComponent, HeaderComponent],
    imports: [BrowserModule, AppRoutingModule, GameModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
