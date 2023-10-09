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


@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.scss']
})
export class ChallengeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('terminal') terminalEl?: ElementRef;
  @ViewChild('promptInput') promptInput: any;
  @ViewChild('challengesListDrawer') challengesListDrawer?: MatSidenav;

  initialPromptInputHeight: number = 0;
  numberofLinesInPromptInput: Array<number> = [0, 1];
  environmentReady: boolean = false;
  webcontainerInstance: any;
  terminal: Terminal;
  tests: any;
  proposedCode: string;
  loadinActivities: Set<string> = new Set("Booting webcontainer");
  bootstrapDialog?: MatDialogRef<BootstrapDialogComponent>;
  currentLanguage = "javascript";
  currentChallenge = "001";
  jsonResult = {};
  challengeDescription = "";
  challengeData: any = {};
  challenges: any;
  availableLanguages = ['javascript', 'python'];
  // challengesData: any = {};
  bootstrapSteps: any = {
    bootwebcontainer: "radio_button_unchecked",
    mountwebcontainer: "radio_button_unchecked",
    installdependancies: "radio_button_unchecked"
  };
  timerRef: any;

  newMessageFormGroup = new UntypedFormGroup({
    promptFormControl: new UntypedFormControl('', [Validators.required])
  });

  currentChallengePath: any;

  issues: any = {
    1: {
      1: { id: 1, title: "one" },
      3: { id: 3, title: "three" },
    },
    3: {
      4: { id: 4, title: "four" },
      5: { id: 5, title: "five" },
    }
  };

  // terminalEl: any;
  constructor(
    private bedrockService: BedrockService,
    private route: ActivatedRoute,
    private router: Router,
    public game: GameService,
    public dialog: MatDialog
  ) {
    // this.updateCurrentChallenge();
    this.proposedCode = "";
    this.loadinActivities = new Set();
    this.terminal = new Terminal({
      convertEol: true,
    });
    // this.buildChallengeData();
    // this.game.buildChallengeData();
    this.bootstrap();
  }

  // buildChallengeData() {
  //   for (const key in files[this.currentLanguage].directory) {
  //     const element = files[this.currentLanguage].directory[key].directory['data.json']?.file.contents || {};

  //     this.challengesData[key] = JSON.parse(element);
  //   }
  // }

  loadChallenge(challengeId: string) {
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: { challengeId: challengeId },
        queryParamsHandling: 'merge'
      });
    this.challengesListDrawer?.close();
  }

  updateCurrentChallenge() {
    this.currentChallengePath = this.game.challenges[this.currentLanguage].directory[this.currentChallenge].directory;
    this.tests = this.currentChallengePath['test.js'].file.contents;

    this.challengeData = this.game.challengesData[this.currentChallenge]
    this.challengeDescription = this.currentChallengePath['challenge.txt'].file.contents;

    this.proposedCode = "";
    this.newMessageFormGroup.reset();
    this.jsonResult = {};
    this.numberofLinesInPromptInput = [0, 1];

    // this.startTimer();
    this.game.startChallenge();
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        if (params['language'] && this.availableLanguages.includes(params['language'])) {
          this.currentLanguage = params['language'];
        }

        if (params['challengeId']) {
          this.currentChallenge = params['challengeId'];
        }
        this.updateCurrentChallenge();
      }
      );
    // this.init();
    this.initGame();

  }

  // startTimer() {
  //   clearInterval(this.timerRef);
  //   this.timerRef = setInterval(() => {
  //     if (this.game.game) {
  //       this.game.updateScore(1);
  //     }
  //   }, 1000);
  // }

  async initGame() {
    await this.game.initContainer(this.terminal);
    if (!this.game.game) {
      this.newGame();
    };
    this.bootstrapDialog?.close();
  }

  ngAfterViewInit() {
    this.initialPromptInputHeight = this.promptInput.nativeElement.scrollHeight;

    if (this.terminalEl) {
      this.terminal.open(this.terminalEl.nativeElement);
    }

  }

  addLoading(operation: string) {
    this.loadinActivities.add(operation);
  }

  removeLoading(operation: string) {
    this.loadinActivities.delete(operation);
  }

  generatePrompt() {

    let input = `
    The generated code should be in ${this.currentLanguage}.
    `

    // Write a function in JavaScript called "sum" that takes 2 parameters and returns their sum
    input += this.newMessageFormGroup.value.promptFormControl;
    const prompt = `
    ${input}
      In your reponse, put the code of the function between the <lc-code></lc-code> xml tags
    `;

    return prompt;
  }

  async generateCode() {
    this.addLoading("Generating code");
    this.game.stopwatch.pause();
    const bedrockResponse = await this.bedrockService.callClaudeV2(this.generatePrompt());
    console.log(bedrockResponse.completion);

    const regex = /<lc-code>(.*?)<\/lc-code>/s;
    try {
      let code = bedrockResponse.completion.match(regex)[1];
      this.proposedCode = code;
      this.game.stopwatch.resume();

      code += `
module.exports = ${this.challengeData.function.name};
      `;
      console.log(code);
      // this.zone.run(() => {

      // this.currentChallengePath['app.js'] = {
      //   file: {
      //     contents: code
      //   }
      // }
      // await this.webcontainerInstance.mount(files);

      const path = `/${this.currentLanguage}/${this.currentChallenge}/app.js`
      // await this.webcontainerInstance.fs.writeFile(path, code);
      this.game.saveCode(path, code);

      // });
    } catch (error) {
      // this.proposedCode = error;
      console.log(error);
    } finally {
      // console.log(this.challenges['app.js']);

      this.removeLoading("Generating code");
    }
  }

  async runTests(): Promise<any> {
    this.addLoading("Running tests");
    const jsonResult = await this.game.runTests(this.terminal, this.currentChallenge);
    this.jsonResult = jsonResult;
    this.removeLoading("Running tests");
    this.dialog.open(ScoreDialogComponent, {
      data: {
        challengeId: this.currentChallenge
      }
    });
  }

  async loadResult() {
    try {
      const resultFile = await this.webcontainerInstance.fs.readFile(`${this.currentLanguage}/${this.currentChallenge}/result.json`, 'utf-8');
      console.log(resultFile);
      this.jsonResult = JSON.parse(resultFile);
    } catch (error) {

    }
  }

  onInputInput(e: any) {
    this.promptInput.nativeElement.style.height = `${this.initialPromptInputHeight}px`;
    this.promptInput.nativeElement.style.height = `${this.promptInput.nativeElement.scrollHeight}px`;
    const nbLines = Math.round(this.promptInput.nativeElement.scrollHeight / 18);

    this.numberofLinesInPromptInput = Array(nbLines).fill(0).map((x, i) => i);
  }

  bootstrap() {
    this.bootstrapDialog = this.dialog.open(BootstrapDialogComponent, {
      data: {
        bootstrapSteps: this.game.bootstrapSteps
      }
    });
  }

  ngOnDestroy() {
    // clearInterval(this.timerRef);
    // this.timerRef.unsubscribe();
  }

  showRules() {
    this.dialog.open(RulesDialogComponent);
  }
  
  newGame() {

    const rulesGameDialog = this.dialog.open(RulesDialogComponent);

    rulesGameDialog.afterClosed().subscribe(result => {
      this.dialog.open(NewGameDialogComponent);
    });
  }
}
