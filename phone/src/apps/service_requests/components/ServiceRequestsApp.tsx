import {useApp} from '@os/apps/hooks/useApps';
import {WordFilterProvider} from '@os/wordfilter/providers/WordFilterProvider';
import {ServiceRequestAppNames, ServiceRequestTypes} from '@typings/servicerequests';
import {AppWrapper} from '@ui/components';
import {AppContent} from '@ui/components/AppContent';
import {AppTitle} from '@ui/components/AppTitle';
import {LoadingSpinner} from '@ui/components/LoadingSpinner';
import React, {memo} from 'react';
import {Route, Switch, useParams} from 'react-router-dom';
import {ServiceRequestThemeProvider} from '../providers/ServiceRequestThemeProvider';
import ServiceRequestForm from './form/ServiceRequestForm';

import ServiceRequestList from './list/ServiceRequestList';
import ServiceRequestNavbar from './ServiceRequestNavbar';
import {useJob} from "@os/phone/hooks/useJob";
import {useCompany} from "@os/phone/hooks/useCompany";

const ServiceRequestsApp = () => {
  const {type} = useParams<{ type: ServiceRequestTypes }>();

  const app = useApp(ServiceRequestAppNames[type]);

  const job = useJob();
  const company = useCompany();
  const shouldDisplayRequests = (() => {
    if (job && job.name === type) return true;
    if (company && company.name === type) return true;
  })()

  return (
    <ServiceRequestThemeProvider>
      <AppWrapper id="service-requests-app">
        <WordFilterProvider>
          <AppTitle app={app}/>
          <AppContent>
            <React.Suspense fallback={<LoadingSpinner/>}>
              {shouldDisplayRequests &&
              <Switch>
                <Route exact path={`/service_requests/:type`}>
                  <ServiceRequestList/>
                </Route>
                <Route path={`/service_requests/:type/create`}>
                  <ServiceRequestForm/>
                </Route>
              </Switch>}
              {!shouldDisplayRequests && <ServiceRequestForm/>}
            </React.Suspense>
          </AppContent>

          <ServiceRequestNavbar/>
        </WordFilterProvider>
      </AppWrapper>
    </ServiceRequestThemeProvider>
  );
};

export default memo(ServiceRequestsApp);