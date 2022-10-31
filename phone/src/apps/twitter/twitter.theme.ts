import { common } from '@mui/material/colors';

export const TWITTER_APP_PRIMARY_COLOR = '#04bf23';
export const TWITTER_APP_TEXT_COLOR = common.white;

const theme = {
  palette: {
    primary: {
      main: TWITTER_APP_PRIMARY_COLOR,
      dark: '#038e1a',
      light: '#00e526',
      contrastText: TWITTER_APP_TEXT_COLOR,
    },
    secondary: {
      main: '#999',
    },
  },
};

export default theme;