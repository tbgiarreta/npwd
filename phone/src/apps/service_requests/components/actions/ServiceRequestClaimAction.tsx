import {IServiceRequest, ServiceRequestStatus} from "@typings/servicerequests";
import {IconButton, Tooltip, Typography} from "@mui/material";
import HandymanIcon from "@mui/icons-material/Handyman";
import React from "react";
import {useServiceRequestsApi} from "@apps/service_requests/hooks/useServiceRequestsApi";

type ServiceRequestClaimActionType = {
  request: IServiceRequest;
};

export const ServiceRequestClaimAction = ({request}: ServiceRequestClaimActionType) => {

  const {claimRequest} = useServiceRequestsApi();

  const handleClaimButtonClicked = function (request: IServiceRequest) {
    claimRequest(request);
  };

  return <Tooltip
    arrow
    title={<Typography variant="body2">Atender</Typography>}
    placement="top-end"
  >
    <IconButton
      edge="end"
      onClick={() => handleClaimButtonClicked(request)}
      size="large"
    >
      <HandymanIcon/>
    </IconButton>
  </Tooltip>;
}