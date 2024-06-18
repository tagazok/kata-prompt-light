import { Component } from '@angular/core';
import { GameService } from '../game.service';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-game-dialog',
  templateUrl: './new-game-dialog.component.html',
  styleUrls: ['./new-game-dialog.component.scss']
})
export class NewGameDialogComponent {
  newGameFormGroup = new UntypedFormGroup({
    userNameFormControl: new UntypedFormControl('', [Validators.required])
  });
  
  constructor(
    private game: GameService,
    private router: Router,
    private dialogRef: MatDialogRef<NewGameDialogComponent>
  ) {
    // if (!this.game.game) {
    //   this.dialogRef.disableClose = true;
    // }
  }
  async newGame() {
    try {
      await this.game.newGame(this.newGameFormGroup.value.userNameFormControl);

      this.dialogRef.close();
      this.router.navigate(['/game', this.game.game.id, 'challenge', 'training'])
    } catch (error) {
      console.log('[new-game-dialog] newGame() ', error)
    }
  }
}
