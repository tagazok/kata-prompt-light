import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { WebContainer } from '@webcontainer/api';
import { Terminal } from 'xterm';

@Component({
  selector: 'app-bootstrap-dialog',
  templateUrl: './bootstrap-dialog.component.html',
  styleUrls: ['./bootstrap-dialog.component.scss']
})
export class BootstrapDialogComponent implements OnInit{
  

  constructor(
    private dialogRef: MatDialogRef<BootstrapDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    dialogRef.disableClose = true;
   
  }
  ngOnInit(): void {
    // this.init();
  }

  async init() {

    // Call only once
    this.data.webcontainerInstance = await WebContainer.boot();


    await this.data.webcontainerInstance.mount(this.data.files);
    // this.startShell();

    const exitCode = await this.installDependencies(this.data.terminal);
    if (exitCode !== 0) {
      throw new Error('Installation failed');
    } else {
      // this.environmentReady = true;
    };
    this.dialogRef.close();
  }

  async installDependencies(terminal: Terminal) {
    // Install dependencies
    const installProcess = await this.data.webcontainerInstance.spawn('npm', ['install']);

    installProcess.output.pipeTo(new WritableStream({
      write(data) {
        terminal.write(data);
        // console.log(data);
      }
    }));

    // Wait for install command to exit
    return installProcess.exit;
  }
}