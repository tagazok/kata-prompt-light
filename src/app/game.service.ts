import { Injectable } from '@angular/core';
import { WebContainer } from '@webcontainer/api';
import { files } from '../assets/files';
import { Terminal } from 'xterm';

interface Player {
  name: string,
  score: number
};

@Injectable({
  providedIn: 'root'
})
export class GameService {
  player?: Player;
  challenges: any;
  webcontainerInstance: any;
  bootstrapSteps: any = {
    bootwebcontainer: "radio_button_unchecked",
    mountwebcontainer: "radio_button_unchecked",
    installdependancies: "radio_button_unchecked"
  };

  constructor(
  ) { }


  newGame(playerName: string) {
    this.player = {
      name: playerName,
      score: 0
    };
  }

  async loadGame() {
    await this.webcontainerInstance.mount(files);
  }

  async initContainer(terminal: Terminal) {

    this.bootstrapSteps.bootwebcontainer = "sync";
    this.webcontainerInstance = await WebContainer.boot();
    this.bootstrapSteps.bootwebcontainer = "check_circle";

    this.bootstrapSteps.mountwebcontainer = "sync";
    await this.webcontainerInstance.mount(files);
    this.startShell(terminal);
    this.bootstrapSteps.mountwebcontainer = "check_circle";

    this.bootstrapSteps.installdependancies = "sync";
    
    // const exitCode = await this.installDependencies(terminal);
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
}
