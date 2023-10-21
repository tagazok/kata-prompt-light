import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChallengeComponent } from './challenge/challenge.component';
import { webcontainersResolver } from './webcontainers.resolver';
import { AppComponent } from './app.component';

const routes: Routes = [
  { 
    path: 'challenge/:challengeId', 
    component: ChallengeComponent,
    resolve: { resolver: webcontainersResolver } 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
