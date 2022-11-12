import {IServiceRequest} from "../../../typings";
import DbInterface from "../db/db_wrapper";

export class _ServiceRequestsDB {
  async getServiceRequests(requestTypes: string[]): Promise<IServiceRequest[]> {
    const query = `SELECT service_requests.id,
                          UNIX_TIMESTAMP(service_requests.date) as date,
                          service_requests.description,
                          service_requests.claimed_by,
                          UNIX_TIMESTAMP(service_requests.claimed_at) claimed_at,
                          service_requests.status,
                          service_requests.extra,
                          service_requests.location,
                          service_requests.is_anonymous,
                          users.identifier as requester_id,
                          concat(users.firstName, ' ', users.lastName) as requester,
                   FROM service_requests
                       JOIN users
                   ON users.identifier = requester_user_identifier
                   WHERE service_requests.request_type IN (?)`;

    return await DbInterface.fetch<IServiceRequest[]>(query, [requestTypes.join(", ")]);
  }

  async addServiceRequest(request: IServiceRequest): Promise<IServiceRequest> {
    const query = `INSERT INTO service_requests
                   (date, description, claimed_by, claimed_at, status, extra, location, is_anonymous,
                    requester_user_identifier)
                   VALUES (NOW(), ?,)`;

    const insertId = await DbInterface.insert(
      query,
      [
        request.description,
        request.claimed_by,
        request.claimed_at,
        request.status,
        JSON.stringify(request.extra),
        JSON.stringify(request.location),
        request.is_anonymous,
        request.requester_id]
    );

    request.id = String(insertId);

    return request;
  }

  async claimServiceRequest(userId: string, requestId: string): Promise<number> {
    const query = `UPDATE service_requests
                   SET claimed_by = ?,
                       claimed_at = NOW(),
                       status     = 'in_progress'
                   WHERE id = ?`;

    return await DbInterface.exec(query, [userId, requestId]);
  }

  async unclaimServiceRequest(requestId: string): Promise<number> {
    const query = `UPDATE service_requests
                   SET claimed_by = null,
                       claimed_at = null,
                       status     = 'submitted'
                   WHERE id = ?`;

    return await DbInterface.exec(query, [requestId]);
  }

  async closeServiceRequest(requesterId: string, feedback: number, requestId: string): Promise<number> {
    const query = `UPDATE service_requests
                   SET feedback = ?,
                       status   = 'closed'
                   WHERE requester_id = ?
                     and id = ?`;

    return await DbInterface.exec(query, [feedback, requesterId, requestId]);
  }

  async getIdentifiersToBroadcast(request: IServiceRequest): Promise<string[]> {
    const query = `SELECT user.id
                   FROM users
                   WHERE job = ?
                      or company = ?`;

    return await DbInterface.fetch<IServiceRequest[]>(query, [request.request_type, request.request_type]).then(users => users.map(user => user.id));
  }
}

const ServiceRequestsDB = new _ServiceRequestsDB();

export default ServiceRequestsDB;