import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Terminal } from 'xterm'
// import 'xterm/css/xterm.css';
import { WebContainer } from '@webcontainer/api';
import { files } from './files';
import { BedrockService } from '../bedrock.service';
import { UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.scss']
})
export class ChallengeComponent implements OnInit, AfterViewInit {
  @ViewChild('terminal') terminalEl?: ElementRef;

  webcontainerInstance: any;
  terminal: Terminal;
  tests: any;
  proposedCode: string;

  currentLanguage = "javascript";
  currentChallenge = "001";
  jsonResult = {};
  challengeDescription = "";

  availableLanguages = ['javascript', 'python'];

  newMessageFormGroup = new UntypedFormGroup({
    promptFormControl: new UntypedFormControl('', [Validators.required])
  });

  currentChallengePath: any;

  // terminalEl: any;
  constructor(
    private bedrockService: BedrockService,
    private zone: NgZone,
    private route: ActivatedRoute
  ) {
    this.updateCurrentChallengePath();
    this.proposedCode = "";
   
    this.terminal = new Terminal({
      convertEol: true,
    });

  }

  updateCurrentChallengePath() {
    this.currentChallengePath = files[this.currentLanguage].directory[this.currentChallenge].directory;
    this.tests = this.currentChallengePath['test.js'].file.contents;
    this.challengeDescription = this.currentChallengePath['challenge.txt'].file.contents;
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        if (params['language'] && this.availableLanguages.includes(params['language']) ) {
          this.currentLanguage = params['language'];
        }

        if (params['challengeId']) {
          this.currentChallenge = params['challengeId'];
        }
        this.updateCurrentChallengePath();
      }
    );
  }

  ngAfterViewInit() {
    if (this.terminalEl) {
      this.terminal.open(this.terminalEl.nativeElement);
    }

    this.init();
  }

  async init() {

    // Call only once
    this.webcontainerInstance = await WebContainer.boot();
    await this.webcontainerInstance.mount(files);
    this.startShell();

    const exitCode = await this.installDependencies(this.terminal);
    if (exitCode !== 0) {
      throw new Error('Installation failed');
    };
  }


  async installDependencies(terminal: Terminal) {
    // Install dependencies
    const installProcess = await this.webcontainerInstance.spawn('npm', ['install']);

    installProcess.output.pipeTo(new WritableStream({
      write(data) {
        terminal.write(data);
        // console.log(data);
      }
    }));

    // Wait for install command to exit
    return installProcess.exit;
  }

  generatePrompt() {
    let input = `The generated code should be in ${this.currentLanguage}.
    `;

    // Write a function in JavaScript called "sum" that takes 2 parameters and returns their sum
    input += this.newMessageFormGroup.value.promptFormControl || `Write a function in ${this.currentLanguage} called 'sum' that takes 2 parameters and returns their sum`;
    const prompt = `
    ${input}
      Then export the function and only this function, not an object so I can run some tests on it
      In your reponse, put the code of the function between the <lc-code></lc-code> xml tags
    `;

    return prompt;
  }

  async generateCode() {
    const bedrockResponse = await this.bedrockService.callClaudeV2(this.generatePrompt());
    console.log(bedrockResponse.completion);

    const regex = /<lc-code>(.*?)<\/lc-code>/s;
    try {
      const code = bedrockResponse.completion.match(regex)[1];
      console.log(code);
      // this.zone.run(() => {
      this.proposedCode = code;
      this.currentChallengePath['app.js'] = {
        file: {
          contents: code
        }
      }
      await this.webcontainerInstance.mount(files);
      // await this.webcontainerInstance.fs.writeFile(this.currentChallengePath['app.js'].file.contents, code);

      // });
    } catch (error) {
      // this.proposedCode = error;
      console.log(error);
    } finally {
      // console.log(files['app.js']);
    }
  }

  async runTests(): Promise<any> {
    const t = this.terminal;
    let th = this;
    // const runTestProcess = await this.webcontainerInstance.spawn('npm', ['run', 'jest']);

    const runTestProcess = await this.webcontainerInstance.spawn('jest', [`${this.currentLanguage}/${this.currentChallenge}/test.js`, '--json', '--outputFile', `${this.currentLanguage}/${this.currentChallenge}/result.json`]);
    runTestProcess.output.pipeTo(new WritableStream({
      write(data) {
        t.write(data);
        // this.terminal.write(data);
        console.log(data);
        th.loadResult();
      }
    }));

    // Wait for install command to exit
    return runTestProcess.exit;
  }

  async loadResult() {
    try {
      const resultFile = await this.webcontainerInstance.fs.readFile(`${this.currentLanguage}/${this.currentChallenge}/result.json`, 'utf-8');
      console.log(resultFile);
      this.jsonResult = JSON.parse(resultFile);
    } catch (error) {

    }
  }



  async startShell() {
    const t = this.terminal
    const shellProcess = await this.webcontainerInstance.spawn('jsh');
    shellProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          t.write(data);
        },
      })
    );

    const input = shellProcess.input.getWriter();
    t.onData((data) => {
      input.write(data);
    });

    return shellProcess;
  };
}
