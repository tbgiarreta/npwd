import {IServiceRequest} from "@typings/servicerequests";
import {IconButton, Tooltip, Typography} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import React from "react";
import {PreDBConversation} from "@typings/messages";
import {useMyPhoneNumber} from "@os/simcard/hooks/useMyPhoneNumber";
import {useMessageAPI} from "@apps/messages/hooks/useMessageAPI";
import {useRecoilValue} from "recoil";
import {phoneState} from "@os/phone/hooks/state";

type ServiceRequestMessageActionParams = {
  request: IServiceRequest;
}

export const ServiceRequestMessageAction = ({request}: ServiceRequestMessageActionParams) => {

  const playerIdentifier = useRecoilValue(phoneState.playerIdentifier);
  const playerPhoneNumber = useMyPhoneNumber();
  const {addConversation} = useMessageAPI();

  const handleChatButtonClicked = function (request: IServiceRequest) {
    const dto: PreDBConversation = {
      conversationLabel: `Atendimento #${request.id}`,
      participants: [`#${request.id}`, playerPhoneNumber, request.extra.contact],
      isGroupChat: true,
    };

    addConversation(dto);
  };

  if (request && request.claimed_by_id !== playerIdentifier) {
    return <></>;
  }

  return <Tooltip arrow title={<Typography variant="body2">Conversar</Typography>} placement="top-end">
    <IconButton
      edge="end"
      onClick={() => handleChatButtonClicked(request)}
      size="large"
    >
      <ChatIcon/>
    </IconButton>
  </Tooltip>;
}