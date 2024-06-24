import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StopwatchService {
  interval: any = null;
  counter: number;

  constructor() {
    this.counter = 0;
  }

  start() {
    this.stop();
    this.interval = setInterval(() => this.incrementCounter(), 1000);
  }

  resume() {
    if (this.interval !== null) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => this.incrementCounter(), 1000);
  }

  incrementCounter() {
    this.counter++;
  }

  pause() {
    clearInterval(this.interval);
  }

  stop() {
    clearInterval(this.interval);
    this.counter = 0;
  }

  getElapsedTimeInSeconds() {
    return this.counter;
  }
}