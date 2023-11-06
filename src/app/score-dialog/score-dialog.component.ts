import { Component, Inject } from '@angular/core';
import { GameService } from '../game.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
  disableClose: boolean = true;

  constructor(
    public game: GameService,
    private dialogRef: MatDialogRef<ScoreDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dialogRef.disableClose = true;
    this.calculateScore();
  }

  async calculateScore() {
    const scoreData = await this.game.getScore(this.data.challengeId);
    console.log(scoreData);
    this.scoreData.total = this.game.game.score + scoreData.tests + scoreData.timeBonus;

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
              if (this.scoreData.challenge === scoreData.challenge) {
                clearInterval(challengeInterval);

                // Total score
                const totalInterval = setInterval(() => {
                  if (this.game.game.score === this.scoreData.total) {
                    clearInterval(totalInterval);
                    this.game.saveGame(scoreData.tests + scoreData.timeBonus + (scoreData.challenge || 0));
                    this.disableClose = false;
                  } else {
                    this.game.game.score++
                  }
                }, 30);
              } else {
                this.scoreData.challenge++;
              }
            }, 60)
          } else {
            this.scoreData.timeBonus++;
          }
        }, 60)
      } else {
        this.scoreData.tests++;
      }
    }, 60)
  }
}
