import { atom, selector, useRecoilValue } from 'recoil';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { buildRespObj } from '@utils/misc';
import {
  IServiceRequest, ServiceRequestEvents, ServiceRequestsMock
} from '@typings/servicerequests';

export const serviceRequestState = {
  requests: atom<IServiceRequest[]>({
    key: 'serviceRequestState',
    default: selector({
      key: 'serviceRequestStateValue',
      get: async () => {
        try {

          const result = await fetchNui<ServerPromiseResp<IServiceRequest[]>>(
            ServiceRequestEvents.FETCH_REQUESTS,
            undefined,
            buildRespObj(ServiceRequestsMock),
          );

          if (result.status !== 'ok') {
            console.error({ result });
          }

          return result.data;
        } catch (e) {
          console.error(e);
          return [];
        }
      },
    }),
  }),
};

export const useServiceRequestStateValue = () => useRecoilValue(serviceRequestState.requests);
