import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChallengeComponent } from './challenge/challenge.component';
import { webcontainersResolver } from './webcontainers.resolver';
import { HomeComponent } from './home/home.component';
import { GameComponent } from './game/game.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'game',
    redirectTo: ''
  },
  {
    path: 'game/:id',
    component: GameComponent,
    resolve: { resolver: webcontainersResolver },
    children: [
      {
        path: '',
        redirectTo: '/',
        pathMatch: 'full'
      },
      {
        path: 'challenge',
        redirectTo: '',
      },
      { 
        path: 'challenge/:challengeId', 
        component: ChallengeComponent,
      }
    ]
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
