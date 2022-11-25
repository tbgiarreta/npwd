import {
  IServiceRequest,
  ServiceRequestAppNames,
  ServiceRequestEvents,
  ServiceRequestTypes,
} from '@typings/servicerequests';
import {useNuiEvent} from 'fivem-nui-react-lib';
import {useCallback} from 'react';
import {useServiceRequestsActions} from './useServiceRequestsActions';
import {useServiceRequestsNotifications} from './useServiceRequestsNotifications';
import {PhoneEvents} from "@typings/phone";
import {useServiceRequestsApi} from "@apps/service_requests/hooks/useServiceRequestsApi";

export const useServiceRequestsService = () => {
  const {fetchRequests} = useServiceRequestsApi();
  const {updateRequest, addRequest} = useServiceRequestsActions();
  const {setNotification} = useServiceRequestsNotifications();

  const addRequestHandler = useCallback(
    (request: IServiceRequest) => {
      addRequest(request);
      setNotification(request);
    },
    [addRequest, setNotification],
  );

  const updateServiceRequestHandler = useCallback(
    (request: IServiceRequest) => {
      console.log("received updateServiceRequestHandler", request);
      updateRequest(request);
    },
    [updateRequest],
  );

  useNuiEvent('PHONE', PhoneEvents.SET_PLAYER_JOB, fetchRequests);
  useNuiEvent('PHONE', PhoneEvents.SET_PLAYER_COMPANY, fetchRequests);

  useNuiEvent<IServiceRequest>(
    ServiceRequestAppNames[ServiceRequestTypes.POLICE],
    ServiceRequestEvents.CLAIM_REQUEST_BROADCAST_SUCCESS,
    updateServiceRequestHandler,
  );

  useNuiEvent<IServiceRequest>(
    ServiceRequestAppNames[ServiceRequestTypes.POLICE],
    ServiceRequestEvents.ADD_REQUEST_BROADCAST_SUCCESS,
    addRequestHandler,
  );

  useNuiEvent<IServiceRequest>(
    ServiceRequestAppNames[ServiceRequestTypes.HOSPITAL],
    ServiceRequestEvents.CLAIM_REQUEST_BROADCAST_SUCCESS,
    updateServiceRequestHandler,
  );

  useNuiEvent<IServiceRequest>(
    ServiceRequestAppNames[ServiceRequestTypes.HOSPITAL],
    ServiceRequestEvents.ADD_REQUEST_BROADCAST_SUCCESS,
    addRequestHandler,
  );

  useNuiEvent<IServiceRequest>(
    ServiceRequestAppNames[ServiceRequestTypes.MECHANIC],
    ServiceRequestEvents.CLAIM_REQUEST_BROADCAST_SUCCESS,
    updateServiceRequestHandler,
  );

  useNuiEvent<IServiceRequest>(
    ServiceRequestAppNames[ServiceRequestTypes.MECHANIC],
    ServiceRequestEvents.ADD_REQUEST_BROADCAST_SUCCESS,
    addRequestHandler,
  );

  useNuiEvent<IServiceRequest>(
    ServiceRequestAppNames[ServiceRequestTypes.TAXI],
    ServiceRequestEvents.CLAIM_REQUEST_BROADCAST_SUCCESS,
    updateServiceRequestHandler,
  );

  useNuiEvent<IServiceRequest>(
    ServiceRequestAppNames[ServiceRequestTypes.TAXI],
    ServiceRequestEvents.ADD_REQUEST_BROADCAST_SUCCESS,
    addRequestHandler,
  );

  useNuiEvent<IServiceRequest>(
    ServiceRequestAppNames[ServiceRequestTypes.REPORTER],
    ServiceRequestEvents.CLAIM_REQUEST_BROADCAST_SUCCESS,
    updateServiceRequestHandler,
  );

  useNuiEvent<IServiceRequest>(
    ServiceRequestAppNames[ServiceRequestTypes.REPORTER],
    ServiceRequestEvents.ADD_REQUEST_BROADCAST_SUCCESS,
    addRequestHandler,
  );

};
