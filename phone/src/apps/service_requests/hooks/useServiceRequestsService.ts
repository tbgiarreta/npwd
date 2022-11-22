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

export const useServiceRequestsService = () => {
  const {claimServiceRequest, addRequest} = useServiceRequestsActions();
  const {setNotification} = useServiceRequestsNotifications();

  const addRequestHandler = useCallback(
    (request: IServiceRequest) => {
      addRequest(request);
      setNotification(request);
    },
    [addRequest, setNotification],
  );

  const claimServiceRequestHandler = useCallback(
    (request: IServiceRequest) => {
      claimServiceRequest(request);
    },
    [claimServiceRequest],
  );

  useNuiEvent<IServiceRequest>(
    ServiceRequestAppNames[ServiceRequestTypes.POLICE],
    ServiceRequestEvents.CLAIM_REQUEST_BROADCAST_SUCCESS,
    claimServiceRequestHandler,
  );

  useNuiEvent<IServiceRequest>(
    ServiceRequestAppNames[ServiceRequestTypes.POLICE],
    ServiceRequestEvents.ADD_REQUEST_BROADCAST_SUCCESS,
    addRequestHandler,
  );

  useNuiEvent<IServiceRequest>(
    ServiceRequestAppNames[ServiceRequestTypes.HOSPITAL],
    ServiceRequestEvents.CLAIM_REQUEST_BROADCAST_SUCCESS,
    claimServiceRequestHandler,
  );

  useNuiEvent<IServiceRequest>(
    ServiceRequestAppNames[ServiceRequestTypes.HOSPITAL],
    ServiceRequestEvents.ADD_REQUEST_BROADCAST_SUCCESS,
    addRequestHandler,
  );

  useNuiEvent<IServiceRequest>(
    ServiceRequestAppNames[ServiceRequestTypes.MECHANIC],
    ServiceRequestEvents.CLAIM_REQUEST_BROADCAST_SUCCESS,
    claimServiceRequestHandler,
  );

  useNuiEvent<IServiceRequest>(
    ServiceRequestAppNames[ServiceRequestTypes.MECHANIC],
    ServiceRequestEvents.ADD_REQUEST_BROADCAST_SUCCESS,
    addRequestHandler,
  );

  useNuiEvent<IServiceRequest>(
    ServiceRequestAppNames[ServiceRequestTypes.TAXI],
    ServiceRequestEvents.CLAIM_REQUEST_BROADCAST_SUCCESS,
    claimServiceRequestHandler,
  );

  useNuiEvent<IServiceRequest>(
    ServiceRequestAppNames[ServiceRequestTypes.TAXI],
    ServiceRequestEvents.ADD_REQUEST_BROADCAST_SUCCESS,
    claimServiceRequestHandler,
  );

  useNuiEvent<IServiceRequest>(
    ServiceRequestAppNames[ServiceRequestTypes.REPORTER],
    ServiceRequestEvents.CLAIM_REQUEST_BROADCAST_SUCCESS,
    addRequestHandler,
  );

  useNuiEvent<IServiceRequest>(
    ServiceRequestAppNames[ServiceRequestTypes.REPORTER],
    ServiceRequestEvents.ADD_REQUEST_BROADCAST_SUCCESS,
    addRequestHandler,
  );
};
