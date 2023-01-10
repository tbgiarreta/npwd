import {mainLogger} from '../sv_logger';
import {PromiseRequest} from "../lib/PromiseNetEvents/promise.types";
import PlayerService from "../players/player.service";

export const messagesLogger = mainLogger.child({module: 'messages'});

export function getPlayerPhoneAndIdentifier(request: PromiseRequest) {
  const player = PlayerService.getPlayer(request.source);

  return [player.getIdentifier(), player.getPhoneNumber()];
}