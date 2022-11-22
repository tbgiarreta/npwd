import {RegisterNuiProxy} from "./cl_utils";
import {IServiceRequest, ServiceRequestEvents} from "@typings/servicerequests";
import {sendServiceRequestMessage} from "../utils/messages";

RegisterNuiProxy(ServiceRequestEvents.ADD_REQUEST);
RegisterNuiProxy(ServiceRequestEvents.FETCH_REQUESTS);
RegisterNuiProxy(ServiceRequestEvents.CLAIM_REQUEST);
RegisterNuiProxy(ServiceRequestEvents.UNCLAIM_REQUEST);
RegisterNuiProxy(ServiceRequestEvents.SERVICE_FEEDBACK);

onNet(ServiceRequestEvents.ADD_REQUEST_BROADCAST_SUCCESS, (request: IServiceRequest) => {
  sendServiceRequestMessage(request, ServiceRequestEvents.ADD_REQUEST_BROADCAST_SUCCESS);
});

onNet(ServiceRequestEvents.CLAIM_REQUEST_BROADCAST_SUCCESS, (request: IServiceRequest) => {
  sendServiceRequestMessage(request, ServiceRequestEvents.CLAIM_REQUEST_BROADCAST_SUCCESS);
});

onNet(ServiceRequestEvents.UNCLAIM_REQUEST_BROADCAST_SUCCESS, (request: IServiceRequest) => {
  sendServiceRequestMessage(request, ServiceRequestEvents.UNCLAIM_REQUEST_BROADCAST_SUCCESS);
});

onNet(ServiceRequestEvents.SERVICE_FEEDBACK_BROADCAST_SUCCESS, (request: IServiceRequest) => {
  sendServiceRequestMessage(request, ServiceRequestEvents.SERVICE_FEEDBACK_BROADCAST_SUCCESS);
});
