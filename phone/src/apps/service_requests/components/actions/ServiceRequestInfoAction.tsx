import {IServiceRequest, ServiceRequestStatus} from "@typings/servicerequests";
import {ListItemIcon, Typography} from "@mui/material";
import {Tooltip} from "@ui/components";
import React from "react";
import SimCardAlertIcon from "@mui/icons-material/SimCardAlert";

type ServiceRequestInfoActionType = {
  request: IServiceRequest;
}

export const ServiceRequestInfoAction = ({request}: ServiceRequestInfoActionType) => {

  if (request.status !== ServiceRequestStatus.IN_PROGRESS) {
    return <></>;
  }

  return <Tooltip
      arrow
      title={<Typography variant="body2">Atendente:
        {request.claimed_by}</Typography>}
      placement="right-start"
    >
      <SimCardAlertIcon/>
    </Tooltip>;
}