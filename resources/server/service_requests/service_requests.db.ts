import {IServiceRequest, ServiceRequestStatus} from "../../../typings";
import DbInterface from "../db/db_wrapper";
import {User} from "@sentry/node";

export class _ServiceRequestsDB {

  async getServiceRequestsForIdentifier(identifier: string): Promise<IServiceRequest[]> {
    const query = `SELECT service_requests.id,
                          UNIX_TIMESTAMP(service_requests.date) as date,
                          service_requests.description,
                          service_requests.claimed_by as claimed_by_id,
                          CONCAT(claimer_user.firstName, ' ', claimer_user.lastName) as claimed_by,
                          service_requests.request_type,
                          UNIX_TIMESTAMP(service_requests.claimed_at) claimed_at,
                          service_requests.status,
                          service_requests.extra,
                          service_requests.location,
                          service_requests.is_anonymous,
                          requester_user.identifier as requester_id,
                          CONCAT(requester_user.firstName, ' ', requester_user.lastName) as requester
                   FROM service_requests
                   INNER JOIN users as requester_user
                     ON requester_user.identifier = requester_user_identifier
                   LEFT JOIN users as claimer_user
                     ON claimer_user.identifier = service_requests.claimed_by
                   JOIN users as employee
                    ON employee.identifier = ? 
                   WHERE employee.job = service_requests.request_type 
                      OR employee.company = service_requests.request_type`;

    return await DbInterface.fetch<IServiceRequest[]>(query, [identifier]);
  }

  async getServiceRequestByIdForIdentifier(request_id: string, identifier: string): Promise<IServiceRequest[]> {
    const query = `SELECT service_requests.id,
                          UNIX_TIMESTAMP(service_requests.date) as date,
                          service_requests.description,
                          service_requests.claimed_by as claimed_by_id,
                          CONCAT(claimer_user.firstName, ' ', claimer_user.lastName) as claimed_by,
                          service_requests.request_type,
                          UNIX_TIMESTAMP(service_requests.claimed_at) claimed_at,
                          service_requests.status,
                          service_requests.extra,
                          service_requests.location,
                          service_requests.is_anonymous,
                          requester_user.identifier as requester_id,
                          CONCAT(requester_user.firstName, ' ', requester_user.lastName) as requester
                   FROM service_requests
                   INNER JOIN users as requester_user
                     ON requester_user.identifier = requester_user_identifier
                   LEFT JOIN users as claimer_user
                     ON claimer_user.identifier = service_requests.claimed_by
                   JOIN users as employee
                    ON employee.identifier = ? 
                   WHERE (employee.job = service_requests.request_type 
                      OR employee.company = service_requests.request_type) 
                      AND service_requests.id = ?`;

    return await DbInterface.fetch<IServiceRequest[]>(query, [identifier, request_id]);
  }

  async addServiceRequest(request: IServiceRequest): Promise<IServiceRequest> {
    const query = `INSERT INTO service_requests
                   (date, description, status, extra, location, is_anonymous,
                    requester_user_identifier, request_type)
                   VALUES (NOW(), ?, '${ServiceRequestStatus.SUBMITTED}', ?, ?, ?, ?, ?)`;

    const location = request.location ? JSON.stringify(request.location) : '';

    const insertId = await DbInterface.insert(
      query,
      [
        request.description,
        JSON.stringify(request.extra),
        location,
        request.is_anonymous,
        request.requester_id,
        request.request_type]
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
    const query = `SELECT identifier
                   FROM users
                   WHERE job = ?
                      or company = ?`;

    return await DbInterface.fetch<User[]>(query, [request.request_type, request.request_type]).then(users => users.map(user => user.identifier));
  }
}

const ServiceRequestsDB = new _ServiceRequestsDB();

export default ServiceRequestsDB;