import { Injectable } from '@angular/core';

import { generateClient } from "aws-amplify/data";
import { Schema } from 'amplify/data/resource';

@Injectable({
  providedIn: 'root'
})
export class InitPlatformService {

  amplifyClient: any;

  constructor() {
    this.amplifyClient = generateClient<Schema>();
  }


  async createChallenges() {

    const { data: challengeDiv } = await this.amplifyClient.models.Challenge.create({
      id: "div",
      title: "Division",
      description: "A function that divides 2 numbers",
      points: 50
    });
    console.log(challengeDiv);

    const { data: test1Div } = await this.amplifyClient.models.Test.create({
      name: 'divide 4 / 4 to equal 1',
      code: `test('divide 4 / 4 to equal 1', () => {
        expect(div(4, 4)).toBe(1);
      });`,
      points: 10,
      challengeId: challengeDiv.id
    });
    console.log(test1Div);

    const { data: test2Div } = await this.amplifyClient.models.Test.create({
      name: 'divide 6 / 2 to equal 3',
      code: `test('divide 6 / 2 to equal 3', () => {
        expect(div(6, 2)).toBe(3);
      });`,
      points: 10,
      challengeId: challengeDiv.id
    });
    console.log(test2Div);

    const { data: test3Div } = await this.amplifyClient.models.Test.create({
      name: 'divide 3 / -1 to equal -3',
      code: `test('divide 3 / -1 to equal -3', () => {
        expect(div(3, -1)).toBe(-3);
      });`,
      points: 10,
      challengeId: challengeDiv.id
    });
    console.log(test3Div);

    const { data: test4Div } = await this.amplifyClient.models.Test.create({
      name: 'divide 3 / -1 to equal -3',
      code: `test('divide 42 / 0 to equal Infinity', () => {
        expect(div(42, 0)).toBe(Infinity);
      });`,
      points: 20,
      challengeId: challengeDiv.id
    });
    console.log(test4Div);

    const { data: challengePal, } = await this.amplifyClient.models.Challenge.create({
      id: "pal",
      title: "Palindrome",
      description: "A **palindrome** is a word, number, phrase, or other sequence of symbols that reads the same backwards as forwards, such as *madam* or *racecar*, the date and time *12/21/33 12:21*.",
      points: 80
    });
    console.log(challengePal);

    const { data: test1Pal } = await this.amplifyClient.models.Test.create({
      name: 'madam is a palindrome',
      code: `test('madam is a palindrome', () => {
        expect(pal('madam')).toBe(true)
      })`,
      points: 20,
      challengeId: challengePal.id
    });
    console.log(test1Pal);

    const { data: test2Pal } = await this.amplifyClient.models.Test.create({
      name: 'coucou is not a palindrome',
      code: `test('coucou is not a palindrome', () => {
        expect(pal('coucou')).toBe(false)
      })`,
      points: 20,
      challengeId: challengePal.id
    });
    console.log(test2Pal);

    const { data: test3Pal } = await this.amplifyClient.models.Test.create({
      name: '12/21/33 12:21 is a palindrome',
      code: `test('12/21/33 12:21 is a palindrome', () => {
        expect(pal('12/21/33 12:21')).toBe(true)
      })`,
      points: 40,
      challengeId: challengePal.id
    });
    console.log(test3Pal);
  }
}
