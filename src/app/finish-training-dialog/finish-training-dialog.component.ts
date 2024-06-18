import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-finish-training-dialog',
  templateUrl: './finish-training-dialog.component.html',
  styleUrls: ['./finish-training-dialog.component.scss']
})
export class FinishTrainingDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<FinishTrainingDialogComponent>
  ) {
    dialogRef.disableClose = true;
  }

  close(startChallenge: boolean) {
    this.dialogRef.close(startChallenge);
  }
}
