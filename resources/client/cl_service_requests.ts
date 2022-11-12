import {RegisterNuiProxy} from "./cl_utils";
import {IServiceRequest, ServiceRequestEvents} from "@typings/servicerequests";
import {sendMessageEvent} from "../utils/messages";

RegisterNuiProxy(ServiceRequestEvents.ADD_REQUEST);
RegisterNuiProxy(ServiceRequestEvents.FETCH_REQUESTS);
RegisterNuiProxy(ServiceRequestEvents.CLAIM_REQUEST);
RegisterNuiProxy(ServiceRequestEvents.UNCLAIM_REQUEST);
RegisterNuiProxy(ServiceRequestEvents.SERVICE_FEEDBACK);

onNet(ServiceRequestEvents.ADD_REQUEST_BROADCAST_SUCCESS, (request: IServiceRequest) => {
  sendMessageEvent(ServiceRequestEvents.ADD_REQUEST_BROADCAST_SUCCESS, request);
});

onNet(ServiceRequestEvents.CLAIM_REQUEST_BROADCAST_SUCCESS, (request: IServiceRequest) => {
  sendMessageEvent(ServiceRequestEvents.CLAIM_REQUEST_BROADCAST_SUCCESS, request);
});

onNet(ServiceRequestEvents.UNCLAIM_REQUEST_BROADCAST_SUCCESS, (request: IServiceRequest) => {
  sendMessageEvent(ServiceRequestEvents.UNCLAIM_REQUEST_BROADCAST_SUCCESS, request);
});

onNet(ServiceRequestEvents.SERVICE_FEEDBACK_BROADCAST_SUCCESS, (request: IServiceRequest) => {
  sendMessageEvent(ServiceRequestEvents.SERVICE_FEEDBACK_BROADCAST_SUCCESS, request);
});