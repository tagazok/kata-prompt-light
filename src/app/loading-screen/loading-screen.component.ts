import { Component } from '@angular/core';
import { LoadingScreenStateService } from '../loading-screen-state.service';
import { BootstrapDialogComponent } from '../bootstrap-dialog/bootstrap-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GameService } from '../game.service';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent {
  // The screen starts with the maximum opacity
  public opacityChange = 1;

  public splashTransition: any;

  // First access the splash is visible
  public showSplash = false;

  readonly ANIMATION_DURATION = 0.2;
  
  bootstrapDialog?: MatDialogRef<BootstrapDialogComponent>;

  constructor(
    private splashScreenStateService: LoadingScreenStateService,
    public dialog: MatDialog,
    public game: GameService,
  ) { 

    // this.bootstrapDialog = this.dialog.open(BootstrapDialogComponent, {
    //   data: {
    //     bootstrapSteps: this.game.bootstrapSteps
    //   }
    // });
  }


  ngOnInit(): void {

    // Somewhere the stop method has been invoked
    this.splashScreenStateService.subscribe((res: any) => {
      if (res) {
        this.showSplash = true;
      } else {
        this.hideSplashAnimation();
      }
    });
  }

  private hideSplashAnimation() {
    // Setting the transition
    this.splashTransition = `opacity ${this.ANIMATION_DURATION}s`;
    this.opacityChange = 0;

    setTimeout(() => {
      // After the transition is ended the showSplash will be hided
      this.showSplash = !this.showSplash;
    }, 200);
  }
}
