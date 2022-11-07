import { useNotification } from '@os/new-notifications/useNotification';
import { INotification } from '@os/notifications/providers/NotificationsProvider';
import {
    IServiceRequest,
    ServiceRequestAppNames,
    ServiceRequestTypes
} from '@typings/servicerequests';
import { useParams } from 'react-router-dom';

const NOTIFICATION_ID = 'npwd:service_request:broadcast';

export const useServiceRequestsNotifications = () => {
  const { enqueueNotification } = useNotification();
  const { type } = useParams<{ type: ServiceRequestTypes }>();

  const setNotification = (request: IServiceRequest) => {
    const id = `${NOTIFICATION_ID}:${request.id}`;

    const content =
      request.description.length > 20
        ? request.description.substring(0, 20) + '...'
        : request.description;

    const notification: INotification = {
      app: ServiceRequestAppNames[type],
      id,
      title: 'Nova requisição de serviço',
      content
    };

    enqueueNotification(notification);
  };

  return { setNotification };
};
