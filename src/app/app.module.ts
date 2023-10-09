import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChallengeComponent } from './challenge/challenge.component';

import {MatTabsModule} from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import { MarkdownModule } from 'ngx-markdown';
import { HighlightService } from './highlight.service';
import { TestResultComponent } from './test-result/test-result.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import { BootstrapDialogComponent } from './bootstrap-dialog/bootstrap-dialog.component';
import { NewGameDialogComponent } from './new-game-dialog/new-game-dialog.component';
import {MatInputModule} from '@angular/material/input';
import { RulesComponent } from './rules/rules.component';
import { RulesDialogComponent } from './rules-dialog/rules-dialog.component';
import { ScoreDialogComponent } from './score-dialog/score-dialog.component';
import { LoadingCubeComponent } from './loading-cube/loading-cube.component';

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
    LoadingCubeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
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
    MarkdownModule.forRoot()
  ],
  providers: [
    HighlightService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
