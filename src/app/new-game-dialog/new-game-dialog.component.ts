import { Component } from '@angular/core';
import { GameService } from '../game.service';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

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
    private dialogRef: MatDialogRef<NewGameDialogComponent>
  ) {

  }
  async newGame() {
    try {
      await this.game.newGame(this.newGameFormGroup.value.userNameFormControl);
      this.dialogRef.close();
    } catch (error) {
      
    }
  }
}
