import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { ServerPromiseResp } from '@typings/common';
import { IServiceRequest, ServiceRequestEvents } from '@typings/servicerequests';
import fetchNui from '@utils/fetchNui';
import { useCallback } from 'react';
import {useServiceRequestsActions} from "@apps/service_requests/hooks/useServiceRequestsActions";

export const useServiceRequestsApi = () => {
  const { addAlert } = useSnackbar();
  const { claimServiceRequest } = useServiceRequestsActions();

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
    (request: IServiceRequest) => {
      fetchNui<ServerPromiseResp<IServiceRequest>>(ServiceRequestEvents.CLAIM_REQUEST, {
        id: request.id,
        request_type: request.request_type
      }).then((response) => {
        if (response.status !== 'ok') {
          return addAlert({
            message: 'Erro ao iniciar o atendimento',
            type: 'error',
          });
        }

        console.log(response);
      });
    },
    [addAlert],
  );

  return { addNewRequest, claimRequest };
};
