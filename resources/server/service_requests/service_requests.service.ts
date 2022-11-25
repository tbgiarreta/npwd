import ServiceRequestsDB, {_ServiceRequestsDB} from "./service_requests.db";
import {serviceRequestsLogger} from "./service_requests.utils";
import {IServiceRequest, ServiceRequestEvents, ServiceRequestStatus} from "../../../typings";
import PlayerService from "../players/player.service";
import {PromiseEventResp, PromiseRequest} from "../lib/PromiseNetEvents/promise.types";

class _ServiceRequestsService {
  private readonly serviceRequestsDB: _ServiceRequestsDB;

  constructor() {
    this.serviceRequestsDB = ServiceRequestsDB;
    serviceRequestsLogger.debug('ServiceRequests service started');
  }

  async handleGetServiceRequests(request: PromiseRequest<void>, response: PromiseEventResp<IServiceRequest[]>) {
    // @fixme: retrieve job + company from player
    const types = ['police', 'hospital', 'mechanic', 'reporter', 'taxi'];

    try {
      const requests = await this.serviceRequestsDB.getServiceRequests(types);

      response({status: 'ok', data: requests});
    } catch (err) {
      serviceRequestsLogger.error(`Falha ao requisitar o serviço. Erro: ${err.message}`);
      response({status: 'error'});
    }
  }

  async handleAddRequest(request: PromiseRequest<IServiceRequest>, response: PromiseEventResp<void>) {
    const identifier = PlayerService.getPlayer(request.source).getIdentifier();

    request.data.requester_id = identifier;

    try {
      const addedRequest = await this.serviceRequestsDB.addServiceRequest(request.data);

      const identifiersToBroadcast = await this.serviceRequestsDB.getIdentifiersToBroadcast(addedRequest);

      identifiersToBroadcast.forEach(identifier => {
        emitNet(ServiceRequestEvents.ADD_REQUEST_BROADCAST_SUCCESS, identifier, addedRequest);
      });

      response({status: 'ok'});
    } catch (err) {
      serviceRequestsLogger.error(`Falha ao requisitar o serviço. Erro: ${err.message}`);
      response({status: 'error'});
    }
  }

  async handleClaimServiceRequest(request: PromiseRequest<IServiceRequest>, response: PromiseEventResp<void>) {
    const identifier = PlayerService.getPlayer(request.source).getIdentifier();

    try {
      await this.serviceRequestsDB.claimServiceRequest(identifier, request.data.id);

      // Essa montagem é só pra fazer o broadcast da atualização
      request.data.claimed_by_id = identifier;
      request.data.claimed_by = PlayerService.getPlayer(request.source).getName();
      request.data.status = ServiceRequestStatus.IN_PROGRESS;

      const identifiersToBroadcast = await this.serviceRequestsDB.getIdentifiersToBroadcast(request.data);

      identifiersToBroadcast.forEach(identifier => {
        emitNet(ServiceRequestEvents.CLAIM_REQUEST_BROADCAST_SUCCESS, identifier, request.data);
      });

      response({status: 'ok'});
    } catch (err) {
      serviceRequestsLogger.error(`Falha ao iniciar atendimento. Erro: ${err.message}`);
      response({status: 'error'});
    }
  }

  async handleUnclaimServiceRequest(request: PromiseRequest<IServiceRequest>, response: PromiseEventResp<void>) {
    const identifier = PlayerService.getPlayer(request.source).getIdentifier();

    try {
      await this.serviceRequestsDB.unclaimServiceRequest(request.data.id);

      // Essa montagem é só pra fazer o broadcast da atualização
      request.data.claimed_by_id = null;
      request.data.claimed_by = null;
      request.data.status = ServiceRequestStatus.SUBMITTED;

      const identifiersToBroadcast = await this.serviceRequestsDB.getIdentifiersToBroadcast(request.data);

      identifiersToBroadcast.forEach(identifier => {
        emitNet(ServiceRequestEvents.UNCLAIM_REQUEST_BROADCAST_SUCCESS, identifier, request.data);
      });

      response({status: 'ok'});
    } catch (err) {
      serviceRequestsLogger.error(`Falha ao cancelar atendimento. Erro: ${err.message}`);
      response({status: 'error'});
    }
  }

  async handleCloseServiceRequest(request: PromiseRequest<IServiceRequest>, response: PromiseEventResp<void>) {
    const identifier = PlayerService.getPlayer(request.source).getIdentifier();

    try {
      await this.serviceRequestsDB.closeServiceRequest(identifier, request.data.feedback, request.data.id);

      // Essa montagem é só pra fazer o broadcast da atualização
      request.data.status = ServiceRequestStatus.CLOSED;

      const identifiersToBroadcast = await this.serviceRequestsDB.getIdentifiersToBroadcast(request.data);

      identifiersToBroadcast.forEach(identifier => {
        emitNet(ServiceRequestEvents.SERVICE_FEEDBACK_BROADCAST_SUCCESS, identifier, request.data);
      });

      response({status: 'ok'});
    } catch (err) {
      serviceRequestsLogger.error(`Falha ao fechar atendimento. Erro: ${err.message}`);
      response({status: 'error'});
    }
  }

}

const ServiceRequestsService = new _ServiceRequestsService();

export default ServiceRequestsService;