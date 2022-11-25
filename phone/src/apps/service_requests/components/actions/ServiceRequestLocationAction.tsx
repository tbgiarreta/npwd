import {IServiceRequest} from "@typings/servicerequests";
import {IconButton, Tooltip, Typography} from "@mui/material";
import TravelExplore from "@mui/icons-material/TravelExplore";
import React from "react";
import fetchNui from "@utils/fetchNui";
import {MessageEvents} from "@typings/messages";

type ServiceRequestLocationActionType = {
  request: IServiceRequest
}

export const ServiceRequestLocationAction = ({request}: ServiceRequestLocationActionType) => {
  const handleLocationButtonClicked = function (request: IServiceRequest) {
    fetchNui(MessageEvents.MESSAGES_SET_WAYPOINT, {
      coords: [request.location.x, request.location.y, request.location.z]
    });
  };

  return <Tooltip
    arrow
    title={<Typography variant="body2">Localização</Typography>}
    placement="top-end"
  >
    <IconButton
      edge="end"
      onClick={() => handleLocationButtonClicked(request)}
      size="large"
    >
      <TravelExplore/>
    </IconButton>
  </Tooltip>;
}