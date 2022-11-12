import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { ServerPromiseResp } from '@typings/common';
import { IServiceRequest, ServiceRequestEvents } from '@typings/servicerequests';
import fetchNui from '@utils/fetchNui';
import { useCallback } from 'react';

export const useServiceRequestsApi = () => {
  const { addAlert } = useSnackbar();

  const addNewRequest = useCallback(
    (
      request_type: Number,
      description: string,
      extra: any,
      location: { x: number; y: number; z: number },
      is_anonymous: boolean,
    ) => {
      fetchNui<ServerPromiseResp<IServiceRequest>>(ServiceRequestEvents.ADD_REQUEST, {
        request_type,
        description,
        extra,
        location,
        is_anonymous,
      }).then(() => {
        addAlert({
          message: 'Chamado criado com sucesso!',
          type: 'success',
        });
      });
    },
    [addAlert],
  );

  const claimRequest = useCallback(
    (id: number) => {
      fetchNui<ServerPromiseResp<IServiceRequest>>(ServiceRequestEvents.CLAIM_REQUEST, {
        id,
      }).then(() => {
        addAlert({
          message: 'foi!',
          type: 'success',
        });
      });
    },
    [addAlert],
  );

  return { addNewRequest, claimRequest };
};
