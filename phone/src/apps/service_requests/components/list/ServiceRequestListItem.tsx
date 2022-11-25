import {IServiceRequest} from "@typings/servicerequests";
import {ListItem, ListItemIcon, ListItemText, Typography} from "@mui/material";
import {ServiceRequestMessageAction} from "@apps/service_requests/components/actions/ServiceRequestMessageAction";
import React, {memo} from "react";
import {ServiceRequestLocationAction} from "@apps/service_requests/components/actions/ServiceRequestLocationAction";
import {ServiceRequestClaimAction} from "@apps/service_requests/components/actions/ServiceRequestClaimAction";
import {ServiceRequestInfoAction} from "@apps/service_requests/components/actions/ServiceRequestInfoAction";
import {makeStyles} from "@mui/styles";

type ServiceRequestListItemType = {
  request: IServiceRequest
}

const useStyles = makeStyles({
  flex: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  }
})

const ServiceRequestListItem = ({request}: ServiceRequestListItemType) => {

  const styles = useStyles();

  return <ListItem divider>

    <ListItemText
      secondary={request.description} classes={{primary: styles.flex}}>
      <Typography variant="body1">Chamado #{request.id}</Typography>
      <ServiceRequestInfoAction request={request}/>
    </ListItemText>
    <ListItemIcon>

      <ServiceRequestMessageAction request={request}/>
      <ServiceRequestLocationAction request={request}/>
      <ServiceRequestClaimAction request={request}/>

    </ListItemIcon>
  </ListItem>;
}

export default memo(ServiceRequestListItem);