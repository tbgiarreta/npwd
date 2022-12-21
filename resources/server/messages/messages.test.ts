import MessagesDB from "../messages/messages.db";

describe('MessagesDB', () => {
  it('canExecuteDatabaseQuery', async () => {
    await expect(
      new Promise((resolve) => {
        MessagesDB.getConversations('19120', '691-8591').then(conversations => {
          console.log(conversations);

          resolve(conversations);
        })
      })
    ).resolves.not.toThrowError()
  });

});
