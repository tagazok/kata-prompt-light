import { Component } from '@angular/core';
import { GameService } from '../game.service';
import { APIService } from '../API.service';
import { API, graphqlOperation } from 'aws-amplify';

@Component({
  selector: 'app-leaderboard-dialog',
  templateUrl: './leaderboard-dialog.component.html',
  styleUrls: ['./leaderboard-dialog.component.scss']
})
export class LeaderboardDialogComponent {
  leaders = [];

  constructor() {
    this.getLeaderBoard();
  }

  async getLeaderBoard() {
    const statement = `query usersByDescendingScore {
      usersByScore(
        sortDirection: DESC
        event: "re:Invent2023"
        limit: 10
      ) {
        items {
          id
          user
          score
          createdAt
          updatedAt
        },
        nextToken
      }
    }`;
    const response = (await API.graphql(
      graphqlOperation(statement)
    )) as any;
    this.leaders = response.data.usersByScore.items;
  }
}
