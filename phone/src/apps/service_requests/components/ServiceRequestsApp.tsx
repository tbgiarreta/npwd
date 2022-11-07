import { useApp } from '@os/apps/hooks/useApps';
import { WordFilterProvider } from '@os/wordfilter/providers/WordFilterProvider';
import {
  ServiceRequestAppNames,
  ServiceRequestStatus,
  ServiceRequestTypes,
} from '@typings/servicerequests';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import { AppTitle } from '@ui/components/AppTitle';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import React from 'react';
import { Route, Switch, useParams } from 'react-router-dom';
import { useServiceRequestsValue } from '../hooks/state';
import { ServiceRequestThemeProvider } from '../providers/ServiceRequestThemeProvider';
import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Tooltip,
  Typography,
} from '@mui/material';
import SimCardAlertIcon from '@mui/icons-material/SimCardAlert';
import HandymanIcon from '@mui/icons-material/Handyman';
import HelpIcon from '@mui/icons-material/Help';

export const ServiceRequestsApp = () => {
  const { type } = useParams<{ type: ServiceRequestTypes }>();

  const app = useApp(ServiceRequestAppNames[type]);

  const requests = useServiceRequestsValue();

  return (
    <ServiceRequestThemeProvider>
      <AppWrapper id="service-requests-app">
        <WordFilterProvider>
          <AppTitle app={app} />
          <AppContent>
            <React.Suspense fallback={<LoadingSpinner />}>
              <Switch>
                <Route exact path={`/service_requests/:type`}>
                  <List
                    subheader={
                      <ListSubheader color="primary" component="div" disableSticky>
                        Requests
                      </ListSubheader>
                    }
                    disablePadding
                  >
                    {requests.map((request) => (
                      <ListItem divider>
                        <ListItemIcon>
                          <SimCardAlertIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Request #${request.id}`}
                          secondary={request.description}
                        />
                        {request.status === ServiceRequestStatus.SUBMITTED && (
                          <ListItemSecondaryAction>
                            <Tooltip
                              arrow
                              title={<Typography variant="body2">Atender</Typography>}
                              placement="top-end"
                            >
                              <IconButton edge="end" onClick={() => {}} size="large">
                                <HandymanIcon />
                              </IconButton>
                            </Tooltip>
                          </ListItemSecondaryAction>
                        )}

                        {request.status === ServiceRequestStatus.IN_PROGRESS && (
                          <ListItemSecondaryAction>
                            <Tooltip
                              arrow
                              title={
                                <Typography variant="body2">
                                  Sendo atendido por: {request.claimed_by}
                                </Typography>
                              }
                              placement="top-end"
                            >
                              <HelpIcon />
                            </Tooltip>
                          </ListItemSecondaryAction>
                        )}
                      </ListItem>
                    ))}
                  </List>
                </Route>
                <Route path={`/service_requests/:type/create`}>
                  <span>create request</span>
                </Route>
                <Route path={`/service_requests/:type/admin`}>
                  <span>manage requests</span>
                </Route>
              </Switch>
            </React.Suspense>
          </AppContent>
        </WordFilterProvider>
      </AppWrapper>
    </ServiceRequestThemeProvider>
  );
};
