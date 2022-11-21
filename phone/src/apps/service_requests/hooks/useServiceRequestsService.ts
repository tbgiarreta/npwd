import {IServiceRequest, ServiceRequestEvents,} from '@typings/servicerequests';
import {useNuiEvent} from 'fivem-nui-react-lib';
import {useCallback} from 'react';
import {useServiceRequestsActions} from './useServiceRequestsActions';
import {useServiceRequestsNotifications} from './useServiceRequestsNotifications';

export const useServiceRequestsService = () => {
  const { claimServiceRequest, addRequest } = useServiceRequestsActions();
  const { setNotification } = useServiceRequestsNotifications();

  const addRequestHandler = useCallback(
    (request: IServiceRequest) => {
      console.log("chegou aqui!");
      console.log(request);
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
    'SERVICEREQUEST',
    ServiceRequestEvents.CLAIM_REQUEST_BROADCAST_SUCCESS,
    claimServiceRequestHandler,
  );

  useNuiEvent<IServiceRequest>(
    'SERVICEREQUEST',
    ServiceRequestEvents.ADD_REQUEST,
    addRequestHandler,
  );
};
