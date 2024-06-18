import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChallengeComponent } from './challenge/challenge.component';

import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MarkdownModule } from 'ngx-markdown';
import { HighlightService } from './highlight.service';
import { TestResultComponent } from './test-result/test-result.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { BootstrapDialogComponent } from './bootstrap-dialog/bootstrap-dialog.component';
import { NewGameDialogComponent } from './new-game-dialog/new-game-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { RulesComponent } from './rules/rules.component';
import { RulesDialogComponent } from './rules-dialog/rules-dialog.component';
import { ScoreDialogComponent } from './score-dialog/score-dialog.component';
import { LoadingCubeComponent } from './loading-cube/loading-cube.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { LeaderboardDialogComponent } from './leaderboard-dialog/leaderboard-dialog.component';
import { PlaceholderComponent } from './placeholder/placeholder.component';
import { HomeComponent } from './home/home.component';
import { GameComponent } from './game/game.component';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { TerminalBottomSheetComponent } from './terminal-bottom-sheet/terminal-bottom-sheet.component';
import { FinishTrainingDialogComponent } from './finish-training-dialog/finish-training-dialog.component';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { LoadingScreenStateService } from './loading-screen-state.service';

const materialImports = [
  FormsModule,
  ReactiveFormsModule,
  MatTabsModule,
  MatButtonModule,
  BrowserAnimationsModule,
  MatMenuModule,
  MatSidenavModule,
  MatListModule,
  MatIconModule,
  MatDialogModule,
  MatInputModule,
  MatBottomSheetModule
];

@NgModule({
  declarations: [
    AppComponent,
    ChallengeComponent,
    TestResultComponent,
    BootstrapDialogComponent,
    NewGameDialogComponent,
    RulesComponent,
    RulesDialogComponent,
    ScoreDialogComponent,
    LoadingCubeComponent,
    LeaderboardDialogComponent,
    PlaceholderComponent,
    HomeComponent,
    GameComponent,
    TerminalBottomSheetComponent,
    FinishTrainingDialogComponent,
    LoadingScreenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ...materialImports,
    MarkdownModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    HighlightService,
    LoadingScreenStateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
