import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingScreenStateService {
  subject = new Subject();

  constructor() { }

  subscribe(onNext: any): Subscription {
    return this.subject.subscribe(onNext);
 }

 start() {
    this.subject.next(true);
 }
 
 stop() {
    this.subject.next(false);
 }
}
