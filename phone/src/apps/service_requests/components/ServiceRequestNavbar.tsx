import HistoryIcon from '@mui/icons-material/History';
import PhoneIcon from '@mui/icons-material/Phone';
import {BottomNavigation, BottomNavigationAction} from '@mui/material';
import {Theme} from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import {ServiceRequestTypes} from '@typings/servicerequests';
import React, {useState} from 'react';
import {NavLink, useLocation} from 'react-router-dom';
import {useJob} from "@os/phone/hooks/useJob";
import {useCompany} from "@os/phone/hooks/useCompany";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  icon: {
    color: theme.palette.primary.main,
  },
}));

const ServiceRequestNavbar: React.FC = () => {
  const classes = useStyles();
  const {pathname} = useLocation();
  const [page, setPage] = useState(pathname);
  const location = useLocation();
  const type = location.pathname.match("service_requests/([^\/+]+)\/?")[1] as ServiceRequestTypes;
  const job = useJob();
  const company = useCompany();
  const shouldDisplayRequests = (() => {
    if (job && job.name === type) return true;
    if (company && company.name === type) return true;
  })()

  const handleChange = (_e, newPage) => {
    setPage(newPage);
  };

  return (
    <BottomNavigation value={page} onChange={handleChange} className={classes.root}>
      {shouldDisplayRequests && <BottomNavigationAction
        label={'Chamados'}
        value={`/service_requests/${type}`}
        component={NavLink}
        icon={<HistoryIcon/>}
        to={`/service_requests/${type}`}
      />}
      <BottomNavigationAction
        label={'Atendimento'}
        value={`/service_requests/${type}/create`}
        color="secondary"
        component={NavLink}
        icon={<PhoneIcon/>}
        to={`/service_requests/${type}/create`}
      />
    </BottomNavigation>
  );
};

export default ServiceRequestNavbar;
