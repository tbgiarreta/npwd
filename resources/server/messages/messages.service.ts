import MessagesDB, {_MessagesDB} from "./messages.db";

import {getPlayerPhoneAndIdentifier, messagesLogger} from "./messages.utils";
import {
  IConversation,
  IGroupCreateRequestDto,
  IGroupUpdateAdminStatusRequestDto,
  IMessage,
  IMessageForDirectMessageRequestDto,
  IMessageForGroupRequestDto,
  IMessageGroup,
  IMessageToBeMarkedAsReadRequestDto
} from "../../../typings";
import {PromiseEventResp, PromiseRequest} from "../lib/PromiseNetEvents/promise.types";

class _MessagesService {
  private readonly messagesDB: _MessagesDB;

  constructor() {
    this.messagesDB = MessagesDB;
    messagesLogger.debug('Messages service started');
  }

  async handleFetchPlayerConversations(request: PromiseRequest<void>,
                                       response: PromiseEventResp<IConversation[]>) {

    const [identifier, phone_number] = getPlayerPhoneAndIdentifier(request);

    try {
      const conversations = await this.messagesDB.getConversations(identifier, phone_number);
      response({status: 'ok', data: conversations})
    } catch (error) {
      response({status: "error", errorMsg: error.message})
    }
  }

  async handleFetchMessagesForGroup(request: PromiseRequest<IMessageForGroupRequestDto>, response: PromiseEventResp<IMessage[]>) {

    const [identifier, phone_number] = getPlayerPhoneAndIdentifier(request);

    try {
      const messages = await this.messagesDB.getMessagesForGroup(identifier, phone_number, request.data.group_id);

      response({status: 'ok', data: messages})
    } catch (error) {
      response({status: 'error', errorMsg: error.message})
    }
  }

  async handleFetchDirectMessages(request: PromiseRequest<IMessageForDirectMessageRequestDto>, response: PromiseEventResp<IMessage[]>) {

    const [identifier, phone_number] = getPlayerPhoneAndIdentifier(request);

    try {
      const messages = await this.messagesDB.getDirectMessages(identifier, phone_number, request.data.contact_number);
      response({status: 'ok', data: messages});
    } catch (error) {
      response({status: 'error', errorMsg: error.message});
    }
  }

  async handleMarkDirectMessageAsRead(request: PromiseRequest<IMessageToBeMarkedAsReadRequestDto>, response: PromiseEventResp<void>) {

    // @TODO: validate if is member of conversation

    try {
      await this.messagesDB.markDirectMessagesAsRead(request.data.message_ids);
      response({status: 'ok'})
    } catch (error) {
      response({status: 'error', errorMsg: error.message})
    }
  }

  async handleCreateGroup(request: PromiseRequest<IGroupCreateRequestDto>, response: PromiseEventResp<IMessageGroup>) {
    const [, phone_number] = getPlayerPhoneAndIdentifier(request);

    const {title, picture} = request.data;

    try {
      const group_id = (await this.messagesDB.createGroup(title, picture)).toString();

      await this.messagesDB.addMemberToGroup(group_id, phone_number, true);

      response({
        status: 'ok',
        data: {id: group_id, title, picture}
      })

    } catch (error) {
      response({status: 'error', errorMsg: error.message});
    }
  }

  async handleUpdateGroup(request: PromiseRequest<IMessageGroup>, response: PromiseEventResp<IMessageGroup>) {
    const {id, title, picture} = request.data;

    // @TODO: validate if is admin

    try {
      await this.messagesDB.updateGroup(id, title, picture);
      response({status: 'ok', data: request.data});
    } catch (error) {
      response({status: 'error', errorMsg: error.message});
    }
  }

  async handleUpdateAdminStatusOfMember(request: PromiseRequest<IGroupUpdateAdminStatusRequestDto>, response: PromiseEventResp<void>) {
    // @TODO: validate if player is group admin

    const {is_admin, group_id, phone_number} = request.data;

    try {
      await this.messagesDB.updateAdminStatusToGroup(group_id, phone_number, is_admin);

      response({status: 'ok'})
    } catch (error) {
      response({status: 'error', errorMsg: error.message})
    }
  }

  async handleMarkGroupAsRead(request: PromiseRequest<IMessageGroup>, response: PromiseEventResp<void>) {

    const [, phone_number] = getPlayerPhoneAndIdentifier(request);

    try {
      await this.messagesDB.updateMessageTimeToGroup(request.data.id, phone_number);
      response({status: 'ok'});
    } catch (error) {
      response({status: 'error', errorMsg: error.message});
    }
  }
}

const MessagesService = new _MessagesService();

export default MessagesService;