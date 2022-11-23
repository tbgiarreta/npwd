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

        return result.data.map(service_request => {

          const extra = service_request.extra && typeof service_request.extra === 'string' || service_request.extra instanceof String
                          ? JSON.parse(String(service_request.extra))
                          : service_request.extra;

          const location = service_request.location && typeof service_request.location === 'string' || service_request.location instanceof String
                          ? JSON.parse(String(service_request.location))
                          : service_request.location;

          return {...service_request, extra: extra, location: location};
        });
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
