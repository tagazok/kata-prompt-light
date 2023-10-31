import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { GameService } from './game.service';

export const gameResolver: ResolveFn<any> = (route, state) => {
  const game = inject(GameService);

  if (game.game?.id) {
    return true;
  }
  
  return game.init(route.params['id']);
};
