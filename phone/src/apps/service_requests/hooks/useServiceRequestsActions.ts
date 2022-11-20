import { IServiceRequest } from '@typings/servicerequests';
import { useRecoilCallback } from 'recoil';
import { serviceRequestsState, useSetServiceRequest } from './state';

interface ServiceRequestsActionValues {
  addRequest: (request: IServiceRequest) => void;
  claimServiceRequest: (request: IServiceRequest) => void;
}

export const useServiceRequestsActions = (): ServiceRequestsActionValues => {
  const setServiceRequests = useSetServiceRequest();

  const addRequest = useRecoilCallback(
    ({ snapshot }) =>
      (request: IServiceRequest) => {
        const { state } = snapshot.getLoadable(serviceRequestsState);

        if (state !== 'hasValue') return;

        setServiceRequests((currentRequests) => [request, ...currentRequests]);
      },
    [setServiceRequests],
  );

  const claimServiceRequest = useRecoilCallback(
    ({ snapshot }) =>
      (request: IServiceRequest) => {
        const { state } = snapshot.getLoadable(serviceRequestsState);

        if (state !== 'hasValue') return;

        setServiceRequests((currentRequests) =>
          currentRequests.map((currentRequest) => {
            if (currentRequest.id === request.id) {
              return {currentRequest, ...request};
            }

            return currentRequest;
          }),
        );
      },
    [setServiceRequests],
  );

  return { addRequest, claimServiceRequest };
};
