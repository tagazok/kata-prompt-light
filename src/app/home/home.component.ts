import { Component } from '@angular/core';
import { RulesDialogComponent } from '../rules-dialog/rules-dialog.component';
import { NewGameDialogComponent } from '../new-game-dialog/new-game-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { InitPlatformService } from '../init-platform.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(
    public dialog: MatDialog,
    private initPlatformService: InitPlatformService
  ) {}
  
  newGame() {

    const rulesGameDialog = this.dialog.open(RulesDialogComponent, {
      panelClass: ['my-dialog']
    });

    rulesGameDialog.afterClosed().subscribe(() => {
      this.dialog.open(NewGameDialogComponent, {
        panelClass: ['my-dialog']
      });
    });
  }

  initPlatform() {
    this.initPlatformService.createChallenges();
  }
}
