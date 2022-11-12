import {useServiceRequestsValue} from '@apps/service_requests/hooks/state';
import ChatIcon from '@mui/icons-material/Chat';
import DirectionsIcon from '@mui/icons-material/Directions';
import HandymanIcon from '@mui/icons-material/Handyman';
import HelpIcon from '@mui/icons-material/Help';
import SimCardAlertIcon from '@mui/icons-material/SimCardAlert';
import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import {IServiceRequest, ServiceRequestStatus, ServiceRequestTypes,} from '@typings/servicerequests';
import React, {useMemo} from 'react';
import {useParams} from 'react-router-dom';
import {useMyPhoneNumber} from "@os/simcard/hooks/useMyPhoneNumber";
import {useMessageAPI} from "@apps/messages/hooks/useMessageAPI";
import {MessageEvents, PreDBConversation} from "@typings/messages";
import fetchNui from "@utils/fetchNui";
import TravelExplore from "@mui/icons-material/TravelExplore";

export const ServiceRequestList = () => {
  const requests = useServiceRequestsValue();
  const myPhoneNumber = useMyPhoneNumber();
  const { addConversation } = useMessageAPI();

  const {type} = useParams<{ type: ServiceRequestTypes }>();

  const handleClaimButtonClicked = function (request: IServiceRequest) {
    console.log(request);
  };

  const handleChatButtonClicked = function (request: IServiceRequest) {
    const dto: PreDBConversation = {
      conversationLabel: `Atendimento #${request.id}`,
      participants: [`#${request.id}`, myPhoneNumber, request.extra.contact],
      isGroupChat: true,
    };

    addConversation(dto);
  };

  const handleLocationButtonClicked = function (request: IServiceRequest) {
    fetchNui(MessageEvents.MESSAGES_SET_WAYPOINT, {
      coords: [request.location.x, request.location.y, request.location.z]
    });
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => request.request_type === type);
  }, [requests, type]);

  return (
    <List disablePadding>
      {filteredRequests.map((request) => (
        <ListItem divider key={request.id}>
          <ListItemIcon>
            <SimCardAlertIcon/>
          </ListItemIcon>
          <ListItemText primary={`Request #${request.id}`} secondary={request.description}/>
          {request.status === ServiceRequestStatus.SUBMITTED && (
            <ListItemSecondaryAction>

              {!request.is_anonymous &&
                  <Tooltip
                      arrow
                      title={<Typography variant="body2">Conversar</Typography>}
                      placement="top-end"
                  >
                      <IconButton
                          edge="end"
                          onClick={() => handleChatButtonClicked(request)}
                          size="large"
                      >
                          <ChatIcon/>
                      </IconButton>
                  </Tooltip>
              }

              <Tooltip
                arrow
                title={<Typography variant="body2">Localização</Typography>}
                placement="top-end"
              >
                <IconButton
                  edge="end"
                  onClick={() => handleLocationButtonClicked(request)}
                  size="large"
                >
                  <TravelExplore />
                </IconButton>
              </Tooltip>

              <Tooltip
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
              </Tooltip>
            </ListItemSecondaryAction>
          )}

          {request.status === ServiceRequestStatus.IN_PROGRESS && (
            <ListItemSecondaryAction>
              <Tooltip
                arrow
                title={
                  <Typography variant="body2">Sendo atendido por: {request.claimed_by}</Typography>
                }
                placement="top-end"
              >
                <HelpIcon/>
              </Tooltip>
            </ListItemSecondaryAction>
          )}
        </ListItem>
      ))}
    </List>
  );
};
