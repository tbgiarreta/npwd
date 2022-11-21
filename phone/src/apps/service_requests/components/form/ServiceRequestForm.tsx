import {Box, Button, Checkbox, FormControlLabel, Paper, Slide, TextField,} from '@mui/material';
import {styled} from '@mui/styles';
import React, {useState} from 'react';
import {useServiceRequestsApi} from "@apps/service_requests/hooks/useServiceRequestsApi";
import {useParams} from "react-router-dom";
import {ServiceRequestTypes} from "@typings/servicerequests";
import {useMyPhoneNumber} from "@os/simcard/hooks/useMyPhoneNumber";
import fetchNui from "@utils/fetchNui";
import {Location, MessageEvents} from "@typings/messages";

const StyledFormModal = styled(Paper)({
  height: '100%',
  width: '100%',
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'column',
});

const ServiceRequestForm = () => {
  const [value, setValue] = useState('');
  const [isLocationEnabled, setIsLocationEnabled] = useState(true);
  const myPhoneNumber = useMyPhoneNumber();

  const { addNewRequest } = useServiceRequestsApi();
  const {type} = useParams<{ type: ServiceRequestTypes }>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLocationEnabled(event.target.checked);
  };

  const handleSendRequest = () => {
    fetchNui<{ data: Location }>(MessageEvents.GET_MESSAGE_LOCATION).then(({ data }) => {
      const coords = {x: data.coords[0], y: data.coords[1], z: data.coords[2]};
      addNewRequest(type, value, { contact: data.phoneNumber }, coords, false);
    });
  };

  return (
    <Slide direction="left" in>
      <StyledFormModal>
        <Box component="form" noValidate autoComplete="off">
          <TextField
            fullWidth
            id="filled-multiline-static"
            label="Informe o motivo do chamado"
            multiline
            rows={10}
            value={value}
            variant="filled"
            onChange={handleChange}
          />

          <FormControlLabel
            label="Enviar localização"
            control={<Checkbox checked={isLocationEnabled} onChange={handleLocationChange} />}
          />

            <Button color="primary" variant="contained" onClick={handleSendRequest}>
              Enviar solicitação
            </Button>

        </Box>
      </StyledFormModal>
    </Slide>
  );
};

export default ServiceRequestForm;
