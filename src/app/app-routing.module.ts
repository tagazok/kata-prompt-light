import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChallengeComponent } from './challenge/challenge.component';
import { webcontainersResolver } from './webcontainers.resolver';
import { PlaceholderComponent } from './placeholder/placeholder.component';
import { HomeComponent } from './home/home.component';
import { GameComponent } from './game/game.component';
import { gameResolver } from './game.resolver';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'game/:id',
    component: GameComponent,
    // resolve: { resolver: webcontainersResolver },
    resolve: { resolver: gameResolver},
    children: [
      {
        path: '',
        component: PlaceholderComponent
      },
      {
        path: 'challenge',
        redirectTo: '',
      },
      { 
        path: 'challenge/:challengeId', 
        component: ChallengeComponent
      }
    ]
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
