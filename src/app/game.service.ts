import { Injectable } from '@angular/core';
import { files } from '../assets/files';
import { Terminal } from 'xterm';
import { APIService, Game } from './API.service';
import { StopwatchService } from './stopwatch.service';
import { WebContainer } from '@webcontainer/api';

const referenceTime = 60; // Reference time for the challenge in seconds
const timeBonusFactor = 0.5; // Time bonus factor (points per second saved)
const event = "re:Invent2023";

interface ChallengeData {
  name?: string,
  completionPoints?: number
  // description?: string,
  tests?: Array<any>,
  // time?: number,
  // score?: number,
  // done?: boolean
}

interface ChallengesData {
  [name: string]: ChallengeData;
}

interface ChallengeTempData {
  passTests: Set<string>,
  elapsedTime: number,
  done: boolean
};

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
  challengesData: ChallengesData = {};
  terminal: Terminal;
  currentLanguage = "javascript";
  currentChallenge = "001";

  // Store data relatives to 
  challengesTempData: Record<string, ChallengeTempData> = {};

  // challengesScoreAndTime: any = {}
  constructor(
    private api: APIService,
    public stopwatch: StopwatchService
  ) {
    this.buildChallengeData();
    this.challenges = files;
    this.terminal = new Terminal({
      convertEol: true,
    });
  }

  checkifUserExists(playerName: string) {
    
  }

  async init(gameId: string) {
    this.game = await this.api.GetGame(gameId);
  }

  async newGame(playerName: string) {
    this.game = {
      user: playerName,
      score: 0,
      event: event,
      completedChallenges: new Array<String>()
    } as Game;

    try {
      
      this.game = await this.api.CreateGame(this.game);
      console.log('Game created!');
      console.log(this.game);

      // await this.mountFileSystem();

    } catch (error) {
      console.log('Error creating game...', error);
    }
  }

  save() {
  }

  async mountFileSystem() {
    await this.webcontainerInstance.mount(files);
  }

  async initContainer() {

    console.log("bootwebcontainer");
    this.bootstrapSteps.bootwebcontainer = "sync";
    this.webcontainerInstance = await WebContainer.boot();
    this.bootstrapSteps.bootwebcontainer = "check_circle";

    console.log("mountwebcontainer");
    this.bootstrapSteps.mountwebcontainer = "sync";
    await this.mountFileSystem();
    await this.startShell();
    this.bootstrapSteps.mountwebcontainer = "check_circle";

    console.log("installdependancies");
    this.bootstrapSteps.installdependancies = "sync";
    const exitCode = await this.installDependencies();
    this.bootstrapSteps.installdependancies = "check_circle";
    console.log("installdependancies done");
  }

  async installDependencies() {
    // Install dependencies
    const installProcess = await this.webcontainerInstance.spawn('npm', ['install']);
    const t = this.terminal;
    installProcess.output.pipeTo(new WritableStream({
      write(data) {
        t.write(data);
        console.log(data);
      }
    }));

    // Wait for install command to exit
    return installProcess.exit;
  }

  async runTests(challengeId: string): Promise<any> {
    const t = this.terminal;
    let th = this;
    // const runTestProcess = await this.webcontainerInstance.spawn('npm', ['run', 'jest']);
    this.stopwatch.pause();
    const runTestProcess = await this.webcontainerInstance.spawn('jest', [`${this.currentLanguage}/${challengeId}/test.js`, '--json', '--outputFile', `${this.currentLanguage}/${challengeId}/result.json`]);
    runTestProcess.output.pipeTo(new WritableStream({
      write(data) {
        t.write(data);
        console.log(data);
        th.loadResult(challengeId);
      }
    }));
    // Wait for install command to exit
    await runTestProcess.exit;
    // this.updateScore(challengeId, referenceTime);
    return await this.loadResult(challengeId);
  }

  async getScore(challengeId: string, bonusPoints = []) {
    const results = await this.loadResult(challengeId);
    let score = 0;
    let challenge = this.challengesData[challengeId].completionPoints
    for (const test of results.testResults[0].assertionResults) {
      if (!this.challengesTempData[challengeId]) {
        this.challengesTempData[challengeId] = {
          passTests: new Set<string>(),
          elapsedTime: this.stopwatch.getElapsedTimeInSeconds(),
          done: false
        }
      }
      if (test.status === 'passed') {
        if (!this.challengesTempData[challengeId].passTests.has(test.fullName)) {
          // console.log(`${test.fullName} - ${this.challengesData?[challengeId].tests[test.fullName]}`);

          const challengeTests = this.challengesData[challengeId].tests;
          if (challengeTests) {
            score += challengeTests[test.fullName]
          }
          // score += this.challengesData[challengeId].tests[test.fullName];

          // Specify that the test has already been ran so we don't count the points several times
          this.challengesTempData[challengeId].passTests.add(test.fullName);
        }
      } else {
        challenge = 0;
      }
    }
    let timeBonus = 0;
    if (challenge != 0) {
      if (!this.game.completedChallenges.includes(challengeId)) {
        this.game.completedChallenges.push(challengeId);

        timeBonus = this.calculateTimeBonus(this.stopwatch.getElapsedTimeInSeconds());
      }
    }
    

    return {
      tests: score,
      timeBonus: Math.round(timeBonus),
      challenge: challenge,
      bonusPoints: bonusPoints
    }
  }
  saveGame(inc: number) {
    this.api.UpdateGame({
      id: this.game.id,
      score: this.game.score,
      completedChallenges: this.game.completedChallenges
    });
    // this.game.score += inc;
  }
  // async updateScore(challengeId: string, bonusPoints: number = 0) {
  //   const results = await this.loadResult(challengeId);
  //   console.log(results);
  //   console.log(this.challengesData[challengeId].tests);
  //   let score = 0;
  //   for (const test of results.testResults[0].assertionResults) {
  //     if (test.status === 'passed') {
  //       console.log(`${test.fullName} - ${this.challengesData[challengeId].tests[test.fullName]}`);
  //       score += this.challengesData[challengeId].tests[test.fullName];
  //     }
  //   }
  //   score += this.calculateTimeBonus(this.stopwatch.getElapsedTimeInSeconds())
  //   this.game.score += score;
  //   // TODO: add the passed tests to an array that is savec in dynamoDB
  // }

  calculateTimeBonus(timerValue: number) {
    const timeSaved = referenceTime - timerValue;
    const timeBonus = timeSaved * timeBonusFactor;

    return Math.max(0, timeBonus);
  }

  buildChallengeData() {
    for (const key in files[this.currentLanguage].directory) {
      const element = files[this.currentLanguage].directory[key].directory['data.json']?.file.contents || {};

      this.challengesData[key] = JSON.parse(element);
    }
  }

  startChallenge() {
    this.stopwatch.start();
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

  async saveCode(path: string, code: string) {
    await this.webcontainerInstance.fs.writeFile(path, code);
  }

  // async updateScore(inc: number) {
  //   console.log(`${this.game.score} - ${inc}`);
  //   this.game.score += inc;
  // }
}
