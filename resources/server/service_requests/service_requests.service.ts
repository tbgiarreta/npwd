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

  async broadcastToSourcesOfRequestType(request: IServiceRequest, event: string) {
    const sourcesToBroadcast = await this.getSourcesOfRequestType(request);

    console.log("About to broadcast " + event + " to " + sourcesToBroadcast.length + " sources!");

    sourcesToBroadcast.forEach(source => {
      console.log("Broadcasting " + event + " to " + source);
      if (source != null) {
        emitNet(event, source, request);
      }
    });
  }

  async getSourcesOfRequestType(request: IServiceRequest): Promise<number[]> {
    const identifiers = await this.serviceRequestsDB.getIdentifiersToBroadcast(request);

    return identifiers.reduce(
      (output: number[], identifier) => {
        const player = PlayerService.getPlayerFromIdentifier(identifier.toString());

        if (!player) {
          return output;
        }

        return output.concat(player.source);

      }, []);
  }

  async handleGetServiceRequests(request: PromiseRequest<void>, response: PromiseEventResp<IServiceRequest[]>) {
    const identifier = PlayerService.getPlayer(request.source).getIdentifier()

    try {
      const requests = await this.serviceRequestsDB.getServiceRequestsForIdentifier(identifier);

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

      await this.broadcastToSourcesOfRequestType(addedRequest, ServiceRequestEvents.ADD_REQUEST_BROADCAST_SUCCESS);

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
      const updatedRequest = await this.serviceRequestsDB.getServiceRequestByIdForIdentifier(request.data.id, identifier);

      if (updatedRequest.length > 0) {
        await this.broadcastToSourcesOfRequestType(updatedRequest[0], ServiceRequestEvents.CLAIM_REQUEST_BROADCAST_SUCCESS);
      }

      response({status: 'ok'});
    } catch (err) {
      serviceRequestsLogger.error(`Falha ao iniciar atendimento. Erro: ${err.message}`);
      response({status: 'error'});
    }
  }

  async handleUnclaimServiceRequest(request: PromiseRequest<IServiceRequest>, response: PromiseEventResp<void>) {

    try {
      await this.serviceRequestsDB.unclaimServiceRequest(request.data.id);

      request.data.claimed_by_id = null;
      request.data.claimed_by = null;
      request.data.status = ServiceRequestStatus.SUBMITTED;

      await this.broadcastToSourcesOfRequestType(request.data, ServiceRequestEvents.UNCLAIM_REQUEST_BROADCAST_SUCCESS);

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

      request.data.status = ServiceRequestStatus.CLOSED;

      await this.broadcastToSourcesOfRequestType(request.data, ServiceRequestEvents.SERVICE_FEEDBACK_BROADCAST_SUCCESS);

      response({status: 'ok'});
    } catch (err) {
      serviceRequestsLogger.error(`Falha ao fechar atendimento. Erro: ${err.message}`);
      response({status: 'error'});
    }
  }

}

const ServiceRequestsService = new _ServiceRequestsService();

export default ServiceRequestsService;