import { Component } from '@angular/core';
import { generateClient } from 'aws-amplify/api';
import { Schema } from 'amplify/data/resource';

@Component({
  selector: 'app-leaderboard-dialog',
  templateUrl: './leaderboard-dialog.component.html',
  styleUrls: ['./leaderboard-dialog.component.scss']
})
export class LeaderboardDialogComponent {
  leaders: any[] = [];
  amplifyClient: any;

  constructor() {
    this.getLeaderBoard();
  }

  async getLeaderBoard() {

    const amplifyClient = generateClient<Schema>();

    const { data: leaders, errors } = await amplifyClient.models.Game.listGameByEventAndScore({
      event: "testEvent",
      score: {
        gt: 0
      }
    }, {
      limit: 10,
      sortDirection: 'DESC'
    });

    if (!errors) {
      this.leaders = leaders;
    }

    // const { data: leaders, errors } = await amplifyClient.models.Game.list({
    //   limit: 10
    // });
    // if (!errors) {
    //   this.leaders = leaders;
    // }
  }
}
