import { Component } from '@angular/core';
import { GameService } from '../game.service';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterEvent } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BootstrapDialogComponent } from '../bootstrap-dialog/bootstrap-dialog.component';
import { LeaderboardDialogComponent } from '../leaderboard-dialog/leaderboard-dialog.component';
import { RulesDialogComponent } from '../rules-dialog/rules-dialog.component';
import { NewGameDialogComponent } from '../new-game-dialog/new-game-dialog.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { TerminalBottomSheetComponent } from '../terminal-bottom-sheet/terminal-bottom-sheet.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {

  bootstrapDialog?: MatDialogRef<BootstrapDialogComponent>;
  loading: boolean = true;

  constructor(
    public game: GameService,
    private router: Router,
    public dialog: MatDialog,
    private TerminalBottomSheet: MatBottomSheet
  ) {
    // router.events.subscribe((routerEvent: any) => {
    //   if (routerEvent.url?.startsWith("/challenge/")) {
    //     this.checkRouterEvent(routerEvent);
    //   }
    // });
    this.initContainer();
  }

  showTerminal() {
    this.TerminalBottomSheet.open(TerminalBottomSheetComponent);
  }

  async initContainer() {
    if (!this.game.webcontainerInstance) {
      this.bootstrapDialog = this.dialog.open(BootstrapDialogComponent, {
        data: {
          bootstrapSteps: this.game.bootstrapSteps
        }
      });
      await this.game.initContainer();
      this.bootstrapDialog?.close();
    }
  }

  // checkRouterEvent(routerEvent: any): void {
  //   if (routerEvent instanceof NavigationStart) {
  //     if (!this.game.game) {
  //       this.bootstrapDialog = this.dialog.open(BootstrapDialogComponent, {
  //         data: {
  //           bootstrapSteps: this.game.bootstrapSteps
  //         }
  //       });
  //     }
  //   }
  //   if (routerEvent instanceof NavigationEnd ||
  //     routerEvent instanceof NavigationCancel ||
  //     routerEvent instanceof NavigationError) {
  //     this.bootstrapDialog?.close();
  //   }
  // }

  showRules() {
    this.dialog.open(RulesDialogComponent);
  }

  openLeaderBoardDialog() {
    this.dialog.open(LeaderboardDialogComponent);
  }

  endGame() {
    this.router.navigate(['/'])
    // const rulesGameDialog = this.dialog.open(RulesDialogComponent);

    // rulesGameDialog.afterClosed().subscribe(result => {
    //   this.dialog.open(NewGameDialogComponent);
    // });
    // TODO
  }
}
