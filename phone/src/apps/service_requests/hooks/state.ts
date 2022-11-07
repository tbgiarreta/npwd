import { ServerPromiseResp } from '@typings/common';
import {
  IServiceRequest,
  ServiceRequestEvents,
  ServiceRequestsMock,
} from '@typings/servicerequests';
import fetchNui from '@utils/fetchNui';
import { isEnvBrowser } from '@utils/misc';
import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

export const serviceRequestsState = atom<IServiceRequest[]>({
  key: 'serviceRequests',
  default: selector({
    key: 'defaultServiceRequests',
    get: async () => {
      try {
        const result = await fetchNui<ServerPromiseResp<IServiceRequest[]>>(
          ServiceRequestEvents.FETCH_REQUESTS,
        );

        return result.data;
      } catch (e) {
        if (isEnvBrowser()) return ServiceRequestsMock;
        console.error(e);
        return [];
      }
    },
  }),
});

export const useServiceRequestsValue = () => useRecoilValue(serviceRequestsState);
export const useSetServiceRequest = () => useSetRecoilState(serviceRequestsState);
export const useServiceRequests = () => useRecoilState(serviceRequestsState);
