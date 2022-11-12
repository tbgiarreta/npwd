import {
  IServiceRequest,
  ServiceRequestEvents,
  ServiceRequestsMock,
} from '@typings/servicerequests';
import fetchNui from '@utils/fetchNui';
import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

export const serviceRequestsState = atom<IServiceRequest[]>({
  key: 'serviceRequests',
  default: selector({
    key: 'defaultServiceRequests',
    get: async () => {
      try {
        const result = await fetchNui<IServiceRequest[]>(
          ServiceRequestEvents.FETCH_REQUESTS,
          undefined,
          ServiceRequestsMock,
        );

        return result;
      } catch (e) {
        console.error(e);
        return [];
      }
    },
  }),
});

export const useServiceRequestsValue = () => useRecoilValue(serviceRequestsState);
export const useSetServiceRequest = () => useSetRecoilState(serviceRequestsState);
export const useServiceRequests = () => useRecoilState(serviceRequestsState);
