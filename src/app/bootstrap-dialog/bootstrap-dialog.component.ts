import { Component } from '@angular/core';

import { GameService } from '../game.service';

@Component({
  selector: 'app-bootstrap-dialog',
  templateUrl: './bootstrap-dialog.component.html',
  styleUrls: ['./bootstrap-dialog.component.scss']
})
export class BootstrapDialogComponent {

  constructor(
    public gameService: GameService
  ) { }
}