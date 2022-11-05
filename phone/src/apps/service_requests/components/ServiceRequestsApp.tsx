import { useApp } from '@os/apps/hooks/useApps';
import { WordFilterProvider } from '@os/wordfilter/providers/WordFilterProvider';
import { ServiceRequestAppNames, ServiceRequestTypes } from '@typings/servicerequests';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import { AppTitle } from '@ui/components/AppTitle';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import React from 'react';
import { Route, Switch, useParams } from 'react-router-dom';
import { ServiceRequestThemeProvider } from '../providers/ServiceRequestThemeProvider';

export const ServiceRequestsApp = () => {
  const { type } = useParams<{ type: ServiceRequestTypes }>();

  const messages = useApp(ServiceRequestAppNames[type]);

  return (
    <ServiceRequestThemeProvider>
      <AppWrapper id="service-requests-app">
        <WordFilterProvider>
          <AppTitle app={messages} />
          <AppContent>
            <React.Suspense fallback={<LoadingSpinner />}>
              <Switch>
                <Route exact path={`/service_requests/:type`}>
                  <span>list requests</span>
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
