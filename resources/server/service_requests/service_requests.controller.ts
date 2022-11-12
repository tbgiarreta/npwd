import {onNetPromise} from "../lib/PromiseNetEvents/onNetPromise";
import {IServiceRequest, ServiceRequestEvents} from "../../../typings";
import ServiceRequestsService from "./service_requests.service";
import {serviceRequestsLogger} from "./service_requests.utils";

onNetPromise<void, IServiceRequest[]>(
  ServiceRequestEvents.FETCH_REQUESTS,
  async (request, response) => {
    ServiceRequestsService.handleGetServiceRequests(request, response).catch((e) => {
      serviceRequestsLogger.error(
        `Falha ao buscar chamados (${request.source}), Error: ${e.message}`,
      );
      response({status: 'error', errorMsg: 'INTERNAL_ERROR'});
    });
  },
);

onNetPromise<IServiceRequest, void>(
  ServiceRequestEvents.ADD_REQUEST,
  async (request, response) => {
    ServiceRequestsService.handleAddRequest(request, response).catch((e) => {
      serviceRequestsLogger.error(
        `Falha ao criar chamado (${request.source}), Error: ${e.message}`,
      );
      response({status: 'error', errorMsg: 'INTERNAL_ERROR'});
    });
  },
);

onNetPromise<IServiceRequest, void>(
  ServiceRequestEvents.CLAIM_REQUEST,
  async (request, response) => {
    ServiceRequestsService.handleClaimServiceRequest(request, response).catch((e) => {
      serviceRequestsLogger.error(
        `Falha ao atender chamado (${request.source}), Error: ${e.message}`,
      );
      response({status: 'error', errorMsg: 'INTERNAL_ERROR'});
    });
  },
);

onNetPromise<IServiceRequest, void>(
  ServiceRequestEvents.UNCLAIM_REQUEST,
  async (request, response) => {
    ServiceRequestsService.handleUnclaimServiceRequest(request, response).catch((e) => {
      serviceRequestsLogger.error(
        `Falha ao cancelar chamado (${request.source}), Error: ${e.message}`,
      );
      response({status: 'error', errorMsg: 'INTERNAL_ERROR'});
    });
  },
);

onNetPromise<IServiceRequest, void>(
  ServiceRequestEvents.SERVICE_FEEDBACK,
  async (request, response) => {
    ServiceRequestsService.handleCloseServiceRequest(request, response).catch((e) => {
      serviceRequestsLogger.error(
        `Falha ao fechar chamado (${request.source}), Error: ${e.message}`,
      );
      response({status: 'error', errorMsg: 'INTERNAL_ERROR'});
    });
  },
);