import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-test-result',
  templateUrl: './test-result.component.html',
  styleUrls: ['./test-result.component.scss']
})
export class TestResultComponent {
  @Input() result: any;
  // @Input() rawTests: any = "";
  tests: any = [];
  private rTests = "";

  @Input() set rawTests(value: any) {
    
    this.rTests = value;
    this.getTestInputsAndOutputs();
 
 }

  
  constructor() {
    // this.getTestInputsAndOutputs();
  }

  getTestInputsAndOutputs() {
    const regex = /test\('.*?', \(\) => {\s+expect\(.*\('(.+?)'\)\).toBe\((true|false)\)\s+}\)/g;
    const matches = [...this.rTests.matchAll(regex)];
    
    const jsonArray = matches.map(match => ({
      input: match[1],
      output: match[2] === 'true'
    }));

    this.tests = jsonArray;
  }


}
