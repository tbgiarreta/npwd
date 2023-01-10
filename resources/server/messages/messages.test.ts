import MessagesDB from "../messages/messages.db";

describe('MessagesDB', () => {
  it('canExecuteDatabaseQuery', async () => {
    await expect(
      new Promise((resolve) => {
        MessagesDB.getConversations('19120', '691-8591').then(conversations => {
          expect(conversations.length).toBeGreaterThan(0);
          resolve(conversations);
        })
      })
    ).resolves.not.toThrowError()
  });

  it('canCreateReadAndDeleteMessage', async () => {

    const message = 'Hello world!';
    const sender_identifier = '19120';
    const sender_user_phone = '691-8591';
    const receiver_user_phone = '111-2887';

    await expect(
      new Promise((resolve) => {
        MessagesDB.createMessage(message, sender_user_phone, receiver_user_phone).then((id) => {

          expect(id).toBeGreaterThan(0);

          MessagesDB.getDirectMessages(sender_identifier, sender_user_phone, receiver_user_phone).then((conversations) => {
            expect(conversations.length).toBeGreaterThan(0);

            const conversation = conversations.find(conversation => conversation.id.toString() === id.toString());
            expect(conversation).not.toBeNull();
            expect(conversation.id.toString()).toBe(id.toString());
            expect(conversation.message).toBe(message);
            expect(conversation.group_id).toBeNull();
            expect(conversation.is_read).toBe(0);
            expect(conversation.sender_user_phone).toBe(sender_user_phone);
            expect(conversation.receiver_user_phone).toBe(receiver_user_phone);
            expect(conversation.display).toBe('Você')
          });

          MessagesDB.deleteMessage(id.toString()).then((affectedRows) => {
            expect(affectedRows).toBeGreaterThan(0);
            resolve(true);
          })
        })
      })
    ).resolves.not.toThrowError()
  });

});
