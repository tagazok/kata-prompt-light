import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-terminal-bottom-sheet',
  templateUrl: './terminal-bottom-sheet.component.html',
  styleUrls: ['./terminal-bottom-sheet.component.scss']
})
export class TerminalBottomSheetComponent implements AfterViewInit {
  @ViewChild('terminal') terminalEl?: ElementRef;
  
  constructor(
    public game: GameService
  ) {}
  
  ngAfterViewInit() {
    if (this.terminalEl) {
      // this.terminal.open(this.terminalEl.nativeElement);
      this.game.terminal.open(this.terminalEl.nativeElement);
    }

  }
}
