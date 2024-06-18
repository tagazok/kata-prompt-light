import { Component } from '@angular/core';
import { GameService } from '../game.service';
import { generateClient } from 'aws-amplify/api';
import { Schema } from 'amplify/data/resource';
// import { APIService, Game } from '../API.service';
// import { API, graphqlOperation } from 'aws-amplify';

@Component({
  selector: 'app-leaderboard-dialog',
  templateUrl: './leaderboard-dialog.component.html',
  styleUrls: ['./leaderboard-dialog.component.scss']
})
export class LeaderboardDialogComponent {
  // leaders: Game[] = [];
  leaders: any[] = [];
  amplifyClient: any;
  
  constructor() {
    this.getLeaderBoard();
  }

  async getLeaderBoard() {
    // const statement = `query usersByDescendingScore {
    //   usersByScore(
    //     sortDirection: DESC
    //     event: "re:Invent2023"
    //     limit: 10
    //   ) {
    //     items {
    //       id
    //       user
    //       score
    //       createdAt
    //       updatedAt
    //     },
    //     nextToken
    //   }
    // }`;
    // const response = (await API.graphql(
    //   graphqlOperation(statement)
    // )) as any;
    // this.leaders = response.data.usersByScore.items;

    const amplifyClient = generateClient<Schema>();
    // const { data: leaders, error } = await amplifyClient.queries.usersByDescendingScore({
    //   sortDirection: 'DESC',
    //   limit: 10,
    // });

    const { data: leaders, errors } = await amplifyClient.models.Game.list({
      limit: 10
    });
    this.leaders = leaders;
  }
}
