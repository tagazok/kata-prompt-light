import { Component } from '@angular/core';
import { GameService } from '../game.service';
import { APIService } from '../API.service';

@Component({
  selector: 'app-leaderboard-dialog',
  templateUrl: './leaderboard-dialog.component.html',
  styleUrls: ['./leaderboard-dialog.component.scss']
})
export class LeaderboardDialogComponent {
  leaders = [
    {
      user: "Olivier",
      score: 1000
    },
    {
      user: "Etienne",
      score: 900
    },
    {
      user: "Antonin",
      score: 870
    },
    {
      user: "Isabelle",
      score: 810
    },
    {
      user: "Antoine",
      score: 780
    },
    {
      user: "Madeleine",
      score: 700
    },
    {
      user: "Raymond",
      score: 650
    },
    {
      user: "Andrée",
      score: 600
    },
    {
      user: "Jaques",
      score: 600
    },
    {
      user: "Alice",
      score: 580
    }
  ]
  constructor(
    private api: APIService,
  ) {

  }
}
