import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Terminal } from 'xterm'
// import 'xterm/css/xterm.css';
import { WebContainer } from '@webcontainer/api';
import { files } from '../../assets/files';
import { BedrockService } from '../bedrock.service';
import { UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BootstrapDialogComponent } from '../bootstrap-dialog/bootstrap-dialog.component';
import { GameService } from '../game.service';
import { NewGameDialogComponent } from '../new-game-dialog/new-game-dialog.component';
import { Subscription, timer } from 'rxjs';
import { RulesDialogComponent } from '../rules-dialog/rules-dialog.component';
import { ScoreDialogComponent } from '../score-dialog/score-dialog.component';
import { LeaderboardDialogComponent } from '../leaderboard-dialog/leaderboard-dialog.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { TerminalBottomSheetComponent } from '../terminal-bottom-sheet/terminal-bottom-sheet.component';
import { FinishTrainingDialogComponent } from '../finish-training-dialog/finish-training-dialog.component';


export interface ChatItem {
  role: string,
  content: string
};

@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.scss']
})
export class ChallengeComponent implements OnInit, AfterViewInit {
  @ViewChild('terminal') terminalEl?: ElementRef;
  @ViewChild('promptInput') promptInput: any;
  @ViewChild('challengesListDrawer') challengesListDrawer?: MatSidenav;

  initialPromptInputHeight: number = 0;
  numberofLinesInPromptInput: Array<number> = [0, 1];
  environmentReady: boolean = false;
  webcontainerInstance: any;
  // terminal: Terminal;
  tests: any;
  proposedCode: string;
  loadingActivities: Set<string> = new Set("Booting webcontainer");
  // bootstrapDialog?: MatDialogRef<BootstrapDialogComponent>;
  jsonResult = {};
  challengeDescription = "";
  challengeData: any = {};
  challenges: any;
  availableLanguages = ['javascript', 'python'];

  bootstrapSteps: any = {
    bootwebcontainer: "radio_button_unchecked",
    mountwebcontainer: "radio_button_unchecked",
    installdependancies: "radio_button_unchecked"
  };
  timerRef: any;

  chatItems: ChatItem[] = [];
  loading: boolean = false;
  showConsole: boolean = false;

  newMessageFormGroup = new UntypedFormGroup({
    promptFormControl: new UntypedFormControl('', [Validators.required])
  });
  challenge: any;


  constructor(
    private bedrockService: BedrockService,
    private route: ActivatedRoute,
    private router: Router,
    public game: GameService,
    public dialog: MatDialog,
    private TerminalBottomSheet: MatBottomSheet
  ) {
    this.proposedCode = "";
    this.loadingActivities = new Set();
  }

  updateCurrentChallenge(challengeRef: string) {
  
    console.log(this.game.challenges);
    console.log(this.game.currentChallengeRef);
    this.game.currentChallengeRef = challengeRef;

    this.challenge = this.game.loadChallenge(challengeRef);

    this.proposedCode = "";
    this.newMessageFormGroup.reset();
    this.jsonResult = {};
    this.numberofLinesInPromptInput = [0, 1];
    this.chatItems = [];
    this.showConsole = false;
    this.game.startChallenge();
  }

  ngOnInit() {
    // this.updateCurrentChallenge();
    this.route.params.subscribe(routeParams => {
      // this.game.currentChallengeRef = routeParams['challengeId'] || "";
  
      this.updateCurrentChallenge(routeParams['challengeId'] || "");
      
    });

  }

  async generateCode() {
    this.loading = true;

    this.chatItems.push({
      role: "human",
      content: this.newMessageFormGroup.value.promptFormControl || "",
    });

    this.game.stopwatch.pause();
    const bedrockResponse = await this.bedrockService.callClaudeV2(this.newMessageFormGroup.value.promptFormControl);
    console.log(bedrockResponse);


    this.chatItems.push({
      role: "bot",
      content: bedrockResponse.replace(/<lc-code>.*?<\/lc-code>/s, ""),
    });

    try {
      const regex = /<lc-code>(.*?)<\/lc-code>/s;
      
      let code = bedrockResponse?.match(regex)?.[1] || "";
      this.game.stopwatch.resume();

      code += `
module.exports = ${this.challenge.data.function.name};
      `;

      console.log(code);

      this.proposedCode = code;

      const path = `/javascript/${this.challenge.id}/app.js`
      this.game.saveCode(path, code);

    } catch (error) {
      this.proposedCode = String(error);
      console.log(error);
    } finally {
      this.loading = false;
    }
  }

  async runTests(): Promise<any> {

    this.showConsole = true;
    
    this.loading = true;
    const jsonResult = await this.game.runTests(this.challenge.id);
    this.jsonResult = jsonResult;
  
    this.loading = false;

    if (jsonResult.success) {
      if (this.game.currentChallengeRef === "training") {
        this.dialog.open(FinishTrainingDialogComponent, {
          panelClass: ['my-dialog']
        }).afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          if (result) {
            this.game.currentChallengeRef = "compete";
        
            this.router.navigate(['../challenge', 'compete'], { relativeTo: this.route })
      
          } else {
            this.router.navigate(['/'])
            // TODO: Print "See you soon" and reinit training
          }
        });

      } 
      // else {
      //   this.dialog.open(ScoreDialogComponent, {
      //     data: {
      //       challengeRef: 'compete',
      //       testsData: jsonResult
      //     },
      //     panelClass: ['my-dialog']
      //   });
      // }
    }
    if (this.game.currentChallengeRef === "compete") {
      this.dialog.open(ScoreDialogComponent, {
        data: {
          challengeRef: 'compete',
          testsData: jsonResult
        },
        panelClass: ['my-dialog']
      });
    }
  }

  async loadResult() {
    try {
      const resultFile = await this.webcontainerInstance.fs.readFile(`${this.game.currentLanguage}/${this.game.currentChallengeRef}/result.json`, 'utf-8');
      console.log(resultFile);
      this.jsonResult = JSON.parse(resultFile);
    } catch (error) {

    }
  }

  showTerminal() {
    this.showConsole = !this.showConsole;
    // if (this.terminalEl) {
      // this.terminal.open(this.terminalEl.nativeElement);
      // this.game.startShell();
      // this.game.terminal.open(this.terminalEl.nativeElement);
    // }
  }
  ngAfterViewInit() {
    if (this.terminalEl) {
      this.game.terminal.open(this.terminalEl.nativeElement);
    }
  }

  onInputInput(e: any) {
    this.promptInput.nativeElement.style.height = `${this.initialPromptInputHeight}px`;
    this.promptInput.nativeElement.style.height = `${this.promptInput.nativeElement.scrollHeight}px`;
    const nbLines = Math.round(this.promptInput.nativeElement.scrollHeight / 18);

    this.numberofLinesInPromptInput = Array(nbLines).fill(0).map((x, i) => i);
  }

  onInputKeyDown(e: any) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      this.generateCode();
    }
  }
}
