import { Injectable } from '@angular/core';
import { WebContainer } from '@webcontainer/api';
import { files } from '../assets/files';
import { Terminal } from 'xterm';
import { APIService, Game } from './API.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  game?: any;
  challenges: any;
  webcontainerInstance: any;
  bootstrapSteps: any = {
    bootwebcontainer: "radio_button_unchecked",
    mountwebcontainer: "radio_button_unchecked",
    installdependancies: "radio_button_unchecked"
  };
  currentLanguage = "javascript";

  constructor(
    private api: APIService
  ) { }


  async newGame(playerName: string) {
    this.game = {
      user: playerName,
      score: 0
    };

    try {
      // this.game = await this.api.CreateGame(this.game);
      console.log('Game created!');
      console.log(this.game);

      await this.mountFileSystem();

    } catch (error) {
      console.log('Error creating game...', error);
    }
  }

  save() {
  }

  async mountFileSystem() {
    await this.webcontainerInstance.mount(files);
  }

  async initContainer(terminal: Terminal) {

    this.bootstrapSteps.bootwebcontainer = "sync";
    this.webcontainerInstance = await WebContainer.boot();
    this.bootstrapSteps.bootwebcontainer = "check_circle";

    this.bootstrapSteps.mountwebcontainer = "sync";
    await this.mountFileSystem();
    this.startShell(terminal);
    this.bootstrapSteps.mountwebcontainer = "check_circle";

    this.bootstrapSteps.installdependancies = "sync";
    const exitCode = await this.installDependencies(terminal);
    this.bootstrapSteps.installdependancies = "check_circle";
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

  async runTests(terminal: Terminal, challengeId: string): Promise<any> {
    const t = terminal;
    let th = this;
    // const runTestProcess = await this.webcontainerInstance.spawn('npm', ['run', 'jest']);

    const runTestProcess = await this.webcontainerInstance.spawn('jest', [`${this.currentLanguage}/${challengeId}/test.js`, '--json', '--outputFile', `${this.currentLanguage}/${challengeId}/result.json`]);
    runTestProcess.output.pipeTo(new WritableStream({
      write(data) {
        t.write(data);
        // this.terminal.write(data);
        console.log(data);
        th.loadResult(challengeId);
      }
    }));

    // Wait for install command to exit
    await runTestProcess.exit;
    return await this.loadResult(challengeId);
  }

  async loadResult(challengeId: string) {
    try {
      const resultFile = await this.webcontainerInstance.fs.readFile(`${this.currentLanguage}/${challengeId}/result.json`, 'utf-8');
      console.log(resultFile);
      const jsonResult = JSON.parse(resultFile);
      return jsonResult;
    } catch (error) {

    }
  }

  async startShell(terminal: Terminal) {
    const t = terminal
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

  async saveCode(path: string, code: string) {
    await this.webcontainerInstance.fs.writeFile(path, code);
  }
  
  async updateScore(inc: number) {
    console.log(`${this.game.score} - ${inc}`);
    this.game.score += inc;
  }
}
