import {
  IServiceRequest,
  ServiceRequestClaimRequestDto,
  ServiceRequestEvents,
} from '@typings/servicerequests';
import { useNuiEvent } from 'fivem-nui-react-lib';
import { useCallback } from 'react';
import { useServiceRequestsActions } from './useServiceRequestsActions';
import { useServiceRequestsNotifications } from './useServiceRequestsNotifications';

export const useServiceRequestsService = () => {
  const { claimServiceRequest, addRequest } = useServiceRequestsActions();
  const { setNotification } = useServiceRequestsNotifications();

  const addRequestHandler = useCallback(
    (request: IServiceRequest) => {
      addRequest(request);
      setNotification(request);
    },
    [addRequest, setNotification],
  );

  const claimServiceRequestHandler = useCallback(
    (request: ServiceRequestClaimRequestDto) => {
      claimServiceRequest(request);
    },
    [claimServiceRequest],
  );

  useNuiEvent<ServiceRequestClaimRequestDto>(
    'SERVICEREQUEST',
    ServiceRequestEvents.CLAIM_REQUEST_BROADCAST_SUCCESS,
    claimServiceRequestHandler,
  );

  useNuiEvent<IServiceRequest>(
    'MARKETPLACE',
    ServiceRequestEvents.ADD_REQUEST,
    addRequestHandler,
  );
};
