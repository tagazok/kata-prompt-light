import { Injectable } from '@angular/core';
import { files } from '../assets/files';
import { Terminal } from 'xterm';
// import { APIService, Game } from './API.service';
import { StopwatchService } from './stopwatch.service';
import { WebContainer } from '@webcontainer/api';

import { generateClient } from "aws-amplify/data";
import { Schema } from 'amplify/data/resource';


const referenceTime = 40; // Reference time for the challenge in seconds
const timeBonusFactor = 0.5; // Time bonus factor (points per second saved)
const event = "re:Invent2023";

interface ChallengeData {
  name?: string,
  completionPoints?: number
  // description?: string,
  // tests?: Array<any>,
  tests?: any;
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

interface GameChallenges {
  training: string;
  compete: string;
  [key: string]: string;
}

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
  currentChallengeRef: string = "training";
  currentChallenge: any;
  amplifyClient: any;

  challengesContest: GameChallenges = {
    training: 'div',
    compete: 'pal'
  };

  // Store data relatives to 
  challengesTempData: Record<string, ChallengeTempData> = {};

  // challengesScoreAndTime: any = {}
  constructor(
    // private api: APIService,
    public stopwatch: StopwatchService
  ) {
    // this.buildChallengeData();
    // this.challenges = files;
    this.terminal = new Terminal({
      convertEol: true,
    });

    this.amplifyClient = generateClient<Schema>();
  }

  checkifUserExists(playerName: string) {

  }

  async init(gameId: string) {
    // this.game = await this.api.GetGame(gameId);
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

  loadChallenge(challengeRef: string) {
    this.currentChallenge = this.challenges.javascript.directory[this.challengesContest[this.currentChallengeRef]]
    const challengeData = JSON.parse(this.currentChallenge.directory['data.json'].file.contents);

    return {
      id: this.challengesContest[this.currentChallengeRef],
      data: challengeData,
      description: this.currentChallenge.directory['challenge.txt'].file.contents
    };
  }

  // getCurrentChallenge() {

  //   const challenge = this.challenges.javascript.directory[this.challengesContest[this.currentChallengeRef]];
  //   const challengeData = JSON.parse(challenge.directory['data.json'].file.contents);
    
  //   return {
  //     id: this.challengesContest[this.currentChallengeRef],
  //     data: challengeData,
  //     description: challenge.directory['challenge.txt'].file.contents
  //   };
  // }

  save() {
  }


  // async buildFileSystemChallenge(challenge: any) {
  //   const tests = {

  //   }

  //   for (const test of challenge.tests) {
  //     tests  
  //   }

  //   const fileSystem = {
  //     "directory": {
  //       "test.js": {
  //         "file": {
  //           "contents": `const ${challenge.id} = require('./app');\n\n${challenge.tests.map((t: any) => t.code).join('\n\n')}`
  //         }
  //       }
  //     }
  //   }
  // }

  async buildChallengesData(challenges: any) {
    for (const challenge of challenges) {
      this.challengesData[challenge.id] = {
        name: challenge.title,
        completionPoints: challenge.points,
        // tests: challenge.tests
        tests: challenge.tests.reduce((obj: any, item: any) => ({ ...obj, [item.name]: item }), {})
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
    await this.webcontainerInstance.mount(fileSystem);
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
    const runTestProcess = await this.webcontainerInstance.spawn('jest', [`javascript/${challengeId}/test.js`, '--json', '--outputFile', `${this.currentLanguage}/${challengeId}/result.json`]);
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


    let completionPoints: number = 0;
    let testsScore: number = 0;
    let timeBonus: number = 0;

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
    

    // let challenge = this.challengesData[challengeId].completionPoints;

    // for (const test of testsData.testResults[0].assertionResults) {
    //   if (!this.challengesTempData[challengeId]) {
    //     this.challengesTempData[challengeId] = {
    //       passTests: new Set<string>(),
    //       elapsedTime: this.stopwatch.getElapsedTimeInSeconds(),
    //       done: false
    //     }
    //   }
    //   if (test.status === 'passed') {
    //     if (!this.challengesTempData[challengeId].passTests.has(test.fullName)) {
    //       // console.log(`${test.fullName} - ${this.challengesData?[challengeId].tests[test.fullName]}`);

    //       const challengeTests = this.challengesData[challengeId].tests;
    //       if (challengeTests) {
    //         score += challengeTests[test.fullName]
    //       }
    //       // score += this.challengesData[challengeId].tests[test.fullName];

    //       // Specify that the test has already been ran so we don't count the points several times
    //       this.challengesTempData[challengeId].passTests.add(test.fullName);
    //     }
    //   } else {
    //     challenge = 0;
    //   }
    // }

    // let timeBonus = 0;
    // if (challenge != 0) {
    //   if (!this.game.completedChallenges.includes(challengeId)) {
    //     this.game.completedChallenges.push(challengeId);

    //     timeBonus = this.calculateTimeBonus(this.stopwatch.getElapsedTimeInSeconds());
    //   }
    // }

    return {
      tests: testsScore,
      timeBonus: Math.round(timeBonus),
      completionPoints: completionPoints,
      bonusPoints: bonusPoints
    }
  }


  saveGame(score: number) {
    this.amplifyClient.models.Game.update({
      id: this.game.id,
      score: score
    });
    // this.api.UpdateGame({
    //   id: this.game.id,
    //   score: this.game.score,
    //   completedChallenges: this.game.completedChallenges
    // });


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

  // buildChallengeData() {
  //   for (const key in files[this.currentLanguage].directory) {
  //     const element = files[this.currentLanguage].directory[key].directory['data.json']?.file.contents || {};

  //     this.challengesData[key] = JSON.parse(element);
  //   }
  // }

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
