import { Injectable } from '@angular/core';
import { files } from '../assets/files'

@Injectable({
  providedIn: 'root'
})
export class WebcontainerService {
  webContainerInstance: any;
  files = files;

  constructor() { 

  }

  // async init() {
  //   this.webContainerInstance = await WebContainer.boot();

  //   await this.webContainerInstance.mount(files);
  // }

  // async installDependencies() {
  //   const installProcess = await this.webContainerInstance.spawn('npm', ['install']);

  //   return installProcess;
  // }
}
