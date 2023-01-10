import {onNetPromise} from "../lib/PromiseNetEvents/onNetPromise";
import {IConversation, MessageEvents} from "../../../typings";
import MessagesService from "./messages.service";
import {messagesLogger} from "./messages.utils";

onNetPromise<void, IConversation[]>(
  MessageEvents.FETCH_MESSAGE_CONVERSATIONS,
  async (reqObj, resp) => {
    MessagesService.handleFetchPlayerConversations(reqObj, resp).catch((e) => {
      messagesLogger.error(
        `Error occurred in fetch message conversations (${reqObj.source}), Error: ${e.message}`,
      );
      resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
  },
);

