import {IServiceRequest} from '@typings/servicerequests';
import {SetterOrUpdater, useRecoilCallback} from 'recoil';
import {serviceRequestsState, useSetServiceRequest} from './state';

interface ServiceRequestsActionValues {
  addRequest: (request: IServiceRequest) => void;
  updateRequest: (request: IServiceRequest) => void;
  setServiceRequests: SetterOrUpdater<IServiceRequest[]>;
}

export const useServiceRequestsActions = (): ServiceRequestsActionValues => {
  const setServiceRequests = useSetServiceRequest();

  const addRequest = useRecoilCallback(
    ({snapshot}) =>
      (request: IServiceRequest) => {
        const {state} = snapshot.getLoadable(serviceRequestsState);

        if (state !== 'hasValue') return;

        setServiceRequests((currentRequests) => [request, ...currentRequests]);
      },
    [setServiceRequests],
  );

  const updateRequest = useRecoilCallback(
    ({snapshot}) =>
      (request: IServiceRequest) => {
        setServiceRequests((currentRequests) =>
          currentRequests.map((currentRequest) => {
            if (currentRequest.id.toString() === request.id.toString()) {
              return {
                ...currentRequest,
                status: request.status,
                claimed_by_id: request.claimed_by_id,
                claimed_by: request.claimed_by
              };
            }

            return currentRequest;
          }),
        );
      },
    [setServiceRequests],
  );

  return {addRequest, updateRequest, setServiceRequests};
};
