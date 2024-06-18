import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { WebcontainerService } from './webcontainer.service';
import { inject } from '@angular/core';
import { GameService } from './game.service';
import { LoadingScreenStateService } from './loading-screen-state.service';
import { of } from 'rxjs';

export const webcontainersResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const game = inject(GameService);
  const loadingScreenService = inject(LoadingScreenStateService)

  console.log('*** IN webcontainersResolver ***');
  loadingScreenService.start();

  if (!game.game && route.params['id']) {
    game.getGame(route.params['id']);
  }

  const webcontainerPromise = new Promise((resolve, reject) => {
    if (!game.webcontainerInstance) {
      game.initContainer().then(() => {
        resolve(true);
      });
    } else {
      resolve(true);
    }
  });

  const gamePromise = game.getGame(route.params['id']);

  return Promise.all([webcontainerPromise, gamePromise]).then(() => {
    loadingScreenService.stop();
    return of(true);
  })

  // return new Promise((resolve, reject) => {
  //   if (!game.webcontainerInstance) {
  //     game.initContainer().then(() => {
  //       loadingScreenService.stop();
  //       resolve(true);
  //     });
  //   } else {
  //     resolve(true);
  //   }
  // });
};
