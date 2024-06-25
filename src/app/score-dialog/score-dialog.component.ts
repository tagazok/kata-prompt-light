import { Component, Inject } from '@angular/core';
import { GameService } from '../game.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Tests } from 'src/types';

@Component({
  selector: 'app-score-dialog',
  templateUrl: './score-dialog.component.html',
  styleUrls: ['./score-dialog.component.scss']
})
export class ScoreDialogComponent {
  public scoreData = {
    tests: 0,
    timeBonus: 0,
    challenge: 0,
    total: 0,
  };
  disableClose = true;

  constructor(
    public game: GameService,
    private dialogRef: MatDialogRef<ScoreDialogComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: Tests
  ) {
    this.dialogRef.disableClose = true;

    console.log(this.data)

    this.calculateScore();
  }

  async calculateScore() {
    this.game.game!.score = 0;
    const scoreData = await this.game.getScore(this.data.challengeRef, this.data.testsData);
 
    // this.scoreData.total = this.game.game.score + scoreData.tests + scoreData.timeBonus;
    this.scoreData.total = scoreData.tests + scoreData.completionPoints + scoreData.timeBonus;

    // Tests Score
    const testsInterval = setInterval(() => {
      if (this.scoreData.tests === scoreData.tests) {
        clearInterval(testsInterval);

        // Time score
        const timeBonusInterval = setInterval(() => {
          if (this.scoreData.timeBonus === scoreData.timeBonus) {
            clearInterval(timeBonusInterval);

            // Challenge completion 
            const challengeInterval = setInterval(() => {
              if (this.scoreData.challenge === scoreData.completionPoints) {
                clearInterval(challengeInterval);

                // Total score
 
                const totalInterval = setInterval(() => {
                  if (this.game.game!.score === this.scoreData.total) {
                    clearInterval(totalInterval);
                    this.game.saveGame(this.scoreData.total);
                    this.disableClose = false;
                  } else {
                    this.game.game!.score++
                  }
                }, 15);
              } else {
                this.scoreData.challenge++;
              }
            }, 30)
          } else {
            this.scoreData.timeBonus++;
          }
        }, 30)
      } else {
        this.scoreData.tests++;
      }
    }, 60)
  }

  retry() {
    this.dialogRef.close();
    this.game.stopwatch.resume();
  }
  finishGame() {
    this.dialogRef.close();
    this.router.navigate(['/'])
  }
}
