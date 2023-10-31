import { Component } from '@angular/core';
import { RulesDialogComponent } from '../rules-dialog/rules-dialog.component';
import { NewGameDialogComponent } from '../new-game-dialog/new-game-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(
    public dialog: MatDialog
  ) {}
  
  newGame() {

    const rulesGameDialog = this.dialog.open(RulesDialogComponent);

    rulesGameDialog.afterClosed().subscribe(result => {
      this.dialog.open(NewGameDialogComponent);
    });
  }
}
