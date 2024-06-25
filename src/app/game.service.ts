import { Injectable } from '@angular/core';
import { Terminal } from 'xterm';
import { StopwatchService } from './stopwatch.service';
import { WebContainer } from '@webcontainer/api';

import { generateClient } from "aws-amplify/data";
import { Schema } from 'amplify/data/resource';
import { ChallengeTest, ChallengesData, Game, GameChallenges } from 'src/types';


const referenceTime = 40; // Reference time for the challenge in seconds
const timeBonusFactor = 0.5; // Time bonus factor (points per second saved)
const event = "testEvent";


@Injectable({
  providedIn: 'root'
})
export class GameService {
  game?: Game;
  challenges: any;
  webcontainerInstance: WebContainer | undefined;
  bootstrapSteps = {
    bootwebcontainer: "radio_button_unchecked",
    mountwebcontainer: "radio_button_unchecked",
    installdependancies: "radio_button_unchecked"
  };
  challengesData: any = {};
  terminal: Terminal;
  currentLanguage = "javascript";
  currentChallengeRef = "training";
  amplifyClient: any;

  challengesContest: GameChallenges = {
    training: 'div',
    compete: 'pal'
  };

  constructor(
    public stopwatch: StopwatchService
  ) {
    this.terminal = new Terminal({
      convertEol: true,
    });

    this.amplifyClient = generateClient<Schema>();
  }

  async getGame(gameId: string) {
  
    const game = await this.amplifyClient.models.Game.get({id: gameId});
    this.game = game.data;
    return this.game;
  }

  async newGame(playerName: string) {

    const game = {
      user: playerName,
      score: 0,
      event: event
    };

    try {
      const data = await this.amplifyClient.models.Game.create(game);
      this.game = data.data;
      console.log('Game created!');
      console.log(this.game);
    } catch (error) {
      console.log('Error creating game...', error);
    }
  }

  loadChallenge() {
    const currentChallenge = this.challenges.javascript.directory[this.challengesContest[this.currentChallengeRef]];

    const challengeData = JSON.parse(currentChallenge.directory['data.json'].file.contents);

    return {
      id: this.challengesContest[this.currentChallengeRef],
      data: challengeData,
      description: currentChallenge.directory['challenge.txt'].file.contents
    };
  }
  async buildChallengesData(challenges: any) {
    for (const challenge of challenges) {
    
      this.challengesData[challenge.id] = {
        name: challenge.title,
        completionPoints: challenge.points,
        // tests: challenge.tests
        tests: challenge.tests.reduce((obj: any, item: ChallengeTest) => ({ ...obj, [item.name]: item }), {})
      }
    }
  }

  async buildFileSystem() {
    const { data: challenges, errors } = await this.amplifyClient.models.Challenge.list(
      { selectionSet: ['id', 'title', 'description', 'points', 'tests.*'] },
    );

    this.buildChallengesData(challenges);

    const fileSystem = {
      "package.json": {
        "file": {
          "contents": "{\n    \"name\": \"example-app\",\n    \"type\": \"module\",\n    \"dependencies\": {\n        \"express\": \"latest\",\n        \"nodemon\": \"latest\",\n        \"jest\": \"latest\",\n        \"@jest/globals\": \"latest\",\n        \"python-shell\": \"latest\",\n        \"jest-json-reporter\": \"latest\"\n    },\n    \"scripts\": {\n        \"start\": \"nodemon --watch './' index.js\",\n        \"jest\": \"jest\"\n    }\n}"
        }
      },
      "javascript": {
        "directory": {
        }
      }
    } as any;

    for (const challenge of challenges) {
      fileSystem.javascript.directory[challenge.id] = {
        "directory": {
          "test.js": {
            "file": {
              "contents": `const ${challenge.id} = require('./app');\n\n${challenge.tests.map((t: any) => t.code).join('\n\n')}`
            }
          },
          "challenge.txt": {
            "file": {
              "contents": `**${challenge.title}**\n\n${challenge.description}`
            }
          },
          "data.json": {
            "file": {
              "contents": JSON.stringify({
                name: challenge.title,
                function: {
                  name: challenge.id,
                },
                completionPoints: challenge.points,
                tests: Object.fromEntries(challenge.tests.map((t: any) => [t.name, t.points]))
              }, null, 4)
            }
          }
        }
      }
    }
    return fileSystem;
  }
  async mountFileSystem() {

    const fileSystem = await this.buildFileSystem();
    this.challenges = fileSystem;
    await this.webcontainerInstance!.mount(fileSystem);
  }

  async initContainer() {
    console.log("[game.service.ts : initContainer ... start");
    console.log("bootwebcontainer");
    this.bootstrapSteps.bootwebcontainer = "sync";
    this.webcontainerInstance = await WebContainer.boot();
    this.bootstrapSteps.bootwebcontainer = "check_circle";

    console.log("mountwebcontainer");
    this.bootstrapSteps.mountwebcontainer = "sync";
    await this.mountFileSystem();
    // await this.startShell();
    this.bootstrapSteps.mountwebcontainer = "check_circle";

    console.log("installdependancies");
    this.bootstrapSteps.installdependancies = "sync";
    const exitCode = await this.installDependencies();
    this.bootstrapSteps.installdependancies = "check_circle";
    console.log("installdependancies done");
    
    console.log("[game.service.ts : initContainer ... end");
  }

  async installDependencies() {
    // Install dependencies
    const installProcess = await this.webcontainerInstance!.spawn('npm', ['install']);
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
    const th = this;
    // const runTestProcess = await this.webcontainerInstance.spawn('npm', ['run', 'jest']);
    this.stopwatch.pause();
    const runTestProcess = await this.webcontainerInstance!.spawn('jest', [`javascript/${challengeId}/test.js`, '--json', '--outputFile', `${this.currentLanguage}/${challengeId}/result.json`]);
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

  async getScore(challengeRef: string, testsData: any, bonusPoints = []) {
    const challengeId = this.challengesContest[challengeRef];
    // const results = await this.loadResult(challengeId);


    let completionPoints = 0;
    let testsScore = 0;
    let timeBonus = 0;

    console.log(this.challenges);
    console.log(this.challengesData);
    console.log(testsData);

    for (const test of testsData.testResults[0].assertionResults) {
      
      if (test.status === "passed") {
        const testPoints = this.challengesData[challengeId].tests[test.title].points;
        console.log(`test points (${test.title}): ${testPoints}`);
        testsScore += testPoints;
      } else {
        console.log(`failed test ${test.title}`);
        continue;
      }
    }

    if (testsData.success) {
      completionPoints = this.challengesData[challengeId].completionPoints || 0;
      console.log(`Completion points: ${completionPoints}`);

      timeBonus = this.calculateTimeBonus(this.stopwatch.getElapsedTimeInSeconds());
      console.log(`Time bonus: ${timeBonus}`);
    } else {
      console.log('Some tests failed');
    }

    return {
      tests: testsScore,
      timeBonus: Math.round(timeBonus),
      completionPoints: completionPoints,
      bonusPoints: bonusPoints
    }
  }


  saveGame(score: number) {
    this.amplifyClient.models.Game.update({
      id: this.game?.id,
      score: score
    });
  }

  calculateTimeBonus(timerValue: number) {
    const timeSaved = referenceTime - timerValue;
    const timeBonus = timeSaved * timeBonusFactor;

    return Math.max(0, timeBonus);
  }

  startChallenge() {
    this.stopwatch.start();
  }

  async loadResult(challengeId: string) {
    try {
      const resultFile = await this.webcontainerInstance!.fs.readFile(`${this.currentLanguage}/${challengeId}/result.json`, 'utf-8');
      console.log(resultFile);
      const jsonResult = JSON.parse(resultFile);
      return jsonResult;
    } catch (error) {
      console.log(error);
    }
  }

  async startShell() {
    const t = this.terminal
    const shellProcess = await this.webcontainerInstance!.spawn('jsh');
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
  }

  async saveCode(path: string, code: string) {
    await this.webcontainerInstance!.fs.writeFile(path, code);
  }
}
