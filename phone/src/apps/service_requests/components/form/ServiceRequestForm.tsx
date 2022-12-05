import {Button, Checkbox, FormControlLabel, Paper} from '@mui/material';
import {TextField} from '@ui/components/Input';
import {styled} from '@mui/styles';
import React, {useState} from 'react';
import {useServiceRequestsApi} from "@apps/service_requests/hooks/useServiceRequestsApi";
import {useLocation, useParams} from "react-router-dom";
import {ServiceRequestTypes} from "@typings/servicerequests";
import fetchNui from "@utils/fetchNui";
import {Location, MessageEvents} from "@typings/messages";

const StyledFormModal = styled(Paper)({
  width: '100%',
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'column',
});

const MessageInput = styled(TextField)({
  flex: '1 1 100%',
  padding: '10px 15px',
  marginTop: '15px',
  overflowY: 'auto',
  maxHeight: '300px',
});

const ServiceRequestForm = () => {
  const [value, setValue] = useState('');
  const [isLocationEnabled, setIsLocationEnabled] = useState(true);

  const {addNewRequest} = useServiceRequestsApi();
  const location = useLocation();
  const type = location.pathname.match("service_requests/([^\/+]+)\/?")[1] as ServiceRequestTypes;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLocationEnabled(event.target.checked);
  };

  const handleSendRequest = () => {
    fetchNui<{ data: Location }>(MessageEvents.GET_MESSAGE_LOCATION).then(({data}) => {
      const coords = {x: data.coords[0], y: data.coords[1], z: data.coords[2]};
      addNewRequest(type, value, {contact: data.phoneNumber}, coords, false).then(() => {
        setValue("");
      });
    });
  };

  return (
    <StyledFormModal>
      <MessageInput
        fullWidth
        multiline
        maxRows={8}
        aria-multiline="true"
        inputProps={{style: {fontSize: '1.3em'}}}
        value={value}
        onChange={handleChange}
        placeholder="Informe o motivo do chamado"
      />

      <FormControlLabel
        label="Enviar localização"
        control={<Checkbox checked={isLocationEnabled} onChange={handleLocationChange}/>}
      />

      <Button color="primary" variant="contained" onClick={handleSendRequest}>
        Enviar solicitação
      </Button>

    </StyledFormModal>
  );
};

export default ServiceRequestForm;
