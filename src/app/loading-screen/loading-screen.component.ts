import { Component, OnInit } from '@angular/core';
import { LoadingScreenStateService } from '../loading-screen-state.service';
import { MatDialog } from '@angular/material/dialog';
import { GameService } from '../game.service';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent implements OnInit {
  public opacityChange = 1;

  public splashTransition = '';

  public showSplash = false;

  readonly ANIMATION_DURATION = 0.2;

  constructor(
    private splashScreenStateService: LoadingScreenStateService,
    public dialog: MatDialog,
    public game: GameService,
  ) {
  }

  ngOnInit(): void {
    this.splashScreenStateService.subscribe((res: boolean) => {
      if (res) {
        this.showSplash = true;
      } else {
        this.hideSplashAnimation();
      }
    });
  }

  private hideSplashAnimation() {
    this.splashTransition = `opacity ${this.ANIMATION_DURATION}s`;
    this.opacityChange = 0;

    setTimeout(() => {
      this.showSplash = !this.showSplash;
    }, 200);
  }
}
