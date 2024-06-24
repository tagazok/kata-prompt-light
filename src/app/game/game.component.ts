import { Component } from '@angular/core';
import { GameService } from '../game.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LeaderboardDialogComponent } from '../leaderboard-dialog/leaderboard-dialog.component';
import { RulesDialogComponent } from '../rules-dialog/rules-dialog.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {

  loading = true;

  constructor(
    public game: GameService,
    private router: Router,
    public dialog: MatDialog
  ) {
  }


  showRules() {
    this.dialog.open(RulesDialogComponent, {
      panelClass: ['my-dialog']
    });
  }

  openLeaderBoardDialog() {
    this.dialog.open(LeaderboardDialogComponent);
  }

  endGame() {
    this.router.navigate(['/']);
  }
}
