import { Component } from '@angular/core';
import { GameService } from './game.service';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterEvent } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BootstrapDialogComponent } from './bootstrap-dialog/bootstrap-dialog.component';
import { LeaderboardDialogComponent } from './leaderboard-dialog/leaderboard-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-prompt-engineering-challenge';
  bootstrapDialog?: MatDialogRef<BootstrapDialogComponent>;
  loading: boolean = true;

  constructor(
    public game: GameService,
    private router: Router,
    public dialog: MatDialog
  ) {
    router.events.subscribe((routerEvent: any) => {
      if (routerEvent.url?.startsWith("/challenge/")) {
        this.checkRouterEvent(routerEvent);
      }
    });
  }

  checkRouterEvent(routerEvent: any): void {
    if (routerEvent instanceof NavigationStart) {
      if (!this.game.game) {
        this.bootstrapDialog = this.dialog.open(BootstrapDialogComponent, {
          data: {
            bootstrapSteps: this.game.bootstrapSteps
          }
        });
      }
    }
    if (routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError) {
      this.bootstrapDialog?.close();
    }
  }
}
