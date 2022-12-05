import {createAppThemeProvider} from '@os/apps/utils/createAppThemeProvider';

import {themes} from '../service_request.theme';
import {useLocation} from "react-router-dom";
import {ServiceRequestTypes} from "@typings/servicerequests";
import React from "react";

export const ServiceRequestThemeProvider = function ({children}: { children: React.ReactNode }) {
  const location = useLocation();
  const type = location.pathname.split("/service_requests/")[1] as ServiceRequestTypes;
  const Component = createAppThemeProvider(themes[type]);
  return <Component>{children}</Component>;
}
