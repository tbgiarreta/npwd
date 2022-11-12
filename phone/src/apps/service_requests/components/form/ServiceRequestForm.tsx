import { useServiceRequestsService } from '@apps/service_requests/hooks/useServiceRequestsService';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Slide,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/styles';
import React, { useState } from 'react';

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

  const {} = useServiceRequestsService();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLocationEnabled(event.target.checked);
  };

  const handleSendRequest = () => {
    
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
