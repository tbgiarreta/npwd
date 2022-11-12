import {IServiceRequest, ServiceRequestEvents, ServiceRequestsMock,} from '@typings/servicerequests';
import fetchNui from '@utils/fetchNui';
import {atom, selector, useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {ServerPromiseResp} from "@typings/common";
import {buildRespObj} from "@utils/misc";

export const serviceRequestsState = atom<IServiceRequest[]>({
  key: 'serviceRequests',
  default: selector({
    key: 'defaultServiceRequests',
    get: async () => {
      try {
        const result = await fetchNui<ServerPromiseResp<IServiceRequest[]>>(
          ServiceRequestEvents.FETCH_REQUESTS,
          undefined,
          buildRespObj(ServiceRequestsMock),
        );

        return result.data;
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
