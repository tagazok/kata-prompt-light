import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { WebContainer } from '@webcontainer/api';
import { Terminal } from 'xterm';

import { Schema } from 'amplify/data/resource';
import { generateClient } from "aws-amplify/data";
import { GameService } from '../game.service';

@Component({
  selector: 'app-bootstrap-dialog',
  templateUrl: './bootstrap-dialog.component.html',
  styleUrls: ['./bootstrap-dialog.component.scss']
})
export class BootstrapDialogComponent {
  

  // constructor(
  //   private dialogRef: MatDialogRef<BootstrapDialogComponent>,
  //   @Inject(MAT_DIALOG_DATA) public data: any) {

  //   dialogRef.disableClose = true;
   
  // }
  // ngOnInit(): void {
  //   // this.init();
  // }

  constructor(
    public gameService: GameService
  ) {

  }

  ngOnInit(): void {}

  // async getFileSystem() {
  //   const amplifyClient = generateClient<Schema>();

  //   const { data: challenges, errors } = await amplifyClient.models.Challenge.list();
  //   debugger;
  //   console.log(challenges);
  // }


  // async init() {

  //   // Call only once
  //   this.data.webcontainerInstance = await WebContainer.boot();

  //   // await this.data.webcontainerInstance.mount(this.data.files);
  //   const fileSystem = await this.getFileSystem();
  //   await this.data.webcontainerInstance.mount(fileSystem);
  //   // this.startShell();

  //   const exitCode = await this.installDependencies(this.data.terminal);
  //   if (exitCode !== 0) {
  //     throw new Error('Installation failed');
  //   } else {
  //     // this.environmentReady = true;
  //   };
  //   this.dialogRef.close();
  // }

  // async installDependencies(terminal: Terminal) {
  //   // Install dependencies
  //   const installProcess = await this.data.webcontainerInstance.spawn('npm', ['install']);

  //   installProcess.output.pipeTo(new WritableStream({
  //     write(data) {
  //       terminal.write(data);
  //       // console.log(data);
  //     }
  //   }));

  //   // Wait for install command to exit
  //   return installProcess.exit;
  // }
}