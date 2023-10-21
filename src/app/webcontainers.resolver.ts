import { ResolveFn } from '@angular/router';
import { WebcontainerService } from './webcontainer.service';
import { inject } from '@angular/core';
import { GameService } from './game.service';

export const webcontainersResolver: ResolveFn<any> = (route, state) => {
  const game = inject(GameService);

  if (!game.game) {
    return game.initContainer();
  }

  return true;
};
