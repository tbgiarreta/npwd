import DbInterface from "../db/db_wrapper";
import {IConversation, IMessage} from "../../../typings";

export class _MessagesDB {

  async getConversations(identifier: string, phoneNumber: string): Promise<IConversation[]> {

    const query = `
        SELECT id,
               title AS display,
               (SELECT sent_at <= last_message_time
                FROM message
                WHERE group_id = message_group_member.group_id
                ORDER BY id DESC
                        LIMIT
            1 ) AS is_read, 
            -1 AS last_sender
        FROM
            message_group_member
            INNER JOIN message_group
        ON message_group.id = message_group_member.group_id
        WHERE
            message_group_member.user_phone = :phoneNumber
        UNION
        SELECT IF(
                           :phoneNumber = message.sender_user_phone,
                           message.receiver_user_phone, message.sender_user_phone
                   )                     as id,
               IF(
                       contact.display IS NULL,
                       IF(
                                   :phoneNumber = message.sender_user_phone,
                                   message.receiver_user_phone, message.sender_user_phone
                           ),
                       contact.display
                   )                     as display,
               IF(
                           :phoneNumber = message.sender_user_phone,
                           1, is_read
                   )                     as is_read,
               message.sender_user_phone as last_sender
        FROM message
                 LEFT JOIN npwd_phone_contacts AS contact ON
                    contact.identifier = :identifier and contact.number = IF(
                        :phoneNumber = message.sender_user_phone,
                        message.receiver_user_phone, message.sender_user_phone
                )
        WHERE message.sender_user_phone = :phoneNumber
           OR message.receiver_user_phone = :phoneNumber;
    `;

    return await DbInterface.fetch<IConversation[]>(query, {identifier, phoneNumber});
  }


  async getMessagesForGroup(identifier: string, myPhone: string, groupId: string): Promise<IMessage[]> {
    const query = `SELECT message.id,
                          message.sender_user_phone,
                          message.receiver_user_phone,
                          message.group_id,
                          message.sent_at,
                          message.is_read,
                          IF(contact.display IS NULL,
                             IF(:myPhone = message.sender_user_phone, 'Você', message.sender_user_phone),
                             contact.display) as display
                   FROM message
                            LEFT JOIN npwd_phone_contacts AS contact ON
                       (contact.identifier = :identifier and contact.number = message.sender_user_phone)
                   WHERE group_id = :groupId`;

    return await DbInterface.fetch<IMessage[]>(query, {groupId});
  }

  async getDirectMessages(identifier: string, myPhone: string, otherPhone: string): Promise<IMessage[]> {
    const query = `SELECT message.id,
                          message.message,
                          message.sender_user_phone,
                          message.receiver_user_phone,
                          message.group_id,
                          message.sent_at,
                          message.is_read,
                          IF(contact.display IS NULL,
                             IF(:myPhone = message.sender_user_phone, 'Você', message.sender_user_phone),
                             contact.display) as display
                   FROM message
                            LEFT JOIN npwd_phone_contacts AS contact ON
                               contact.identifier = :identifier and contact.number = IF(
                                   :myPhone = message.sender_user_phone,
                                   message.receiver_user_phone, message.sender_user_phone
                           )
                   WHERE (sender_user_phone = :myPhone AND receiver_user_phone = :otherPhone)
                      OR (sender_user_phone = :otherPhone AND receiver_user_phone = :myPhone)`;

    return await DbInterface.fetch<IMessage[]>(query, {identifier, myPhone, otherPhone});
  }

  // @TODO: make sure to validate the messageIds can be marked as read by the player that requested the action
  async markDirectMessagesAsRead(messageIds: number[]): Promise<number> {

    const conditions = messageIds.map(id => `id = ?`);

    const query = `UPDATE message
                   SET is_read = 1
                   WHERE ${conditions.join(' OR ')}`;

    return await DbInterface.exec(query, messageIds);
  }

  async createGroup(title: string, picture: string): Promise<number> {
    const query = `INSERT INTO message_group (title, picture)
                   VALUES (:title, :picture)`;

    return await DbInterface.insert(query, {title, picture});
  }

  async updateGroup(id: string, title: string, picture: string): Promise<number> {
    const query = `UPDATE message_group
                   SET title   = :title,
                       picture = :picture
                   WHERE id = :id`;

    return await DbInterface.exec(query, {id, title, picture})
  }

  async addMemberToGroup(groupId: string, phone: string, isAdmin: boolean): Promise<number> {
    const query = `INSERT INTO message_group_member (group_id, is_admin, user_phone)
                   VALUES (:groupId, :isAdmin, :phone)`;

    return await DbInterface.exec(query, {groupId, phone, isAdmin: isAdmin ? 1 : 0})
  }

  async updateAdminStatusToGroup(groupId: string, phone: string, isAdmin: boolean): Promise<number> {
    const query = `UPDATE message_group_member
                   SET is_admin = :isAdmin
                   WHERE group_id = :groupId
                     AND user_phone = :phone`;

    return await DbInterface.exec(query, {groupId, phone, isAdmin: isAdmin ? 1 : 0})
  }

  async updateMessageTimeToGroup(groupId: string, phone: string) {
    const query = `UPDATE message_group_member
                   SET last_message_time = CURRENT_TIMESTAMP()
                   WHERE group_id = :groupId
                     AND user_phone = :phone`;

    return await DbInterface.exec(query, {groupId, phone})
  }
}

const MessagesDB = new _MessagesDB();

export default MessagesDB;