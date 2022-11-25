import {useServiceRequestsValue} from '@apps/service_requests/hooks/state';
import {List,} from '@mui/material';
import React, {memo} from 'react';
import ServiceRequestListItem from "@apps/service_requests/components/list/ServiceRequestListItem";

const ServiceRequestList = () => {
  const requests = useServiceRequestsValue();

  return (
    <List disablePadding>
      {requests.map(request => <ServiceRequestListItem key={request.id} request={request}/>)}
    </List>
  );
};


export default memo(ServiceRequestList);