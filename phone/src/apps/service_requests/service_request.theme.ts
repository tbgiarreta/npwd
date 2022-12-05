import {ThemeOptions} from '@mui/material';
import {ServiceRequestTypes} from "@typings/servicerequests";

const theme: ThemeOptions = {
  palette: {
    primary: {
      main: '#233162',
    },
  },
};

export const themes = {
  default: {
    palette: {
      primary: {
        main: '#233162',
      },
    }
  },
  [ServiceRequestTypes.POLICE]: {
    palette: {
      primary: {
        main: '#ff0000',
      },
    }
  },

  [ServiceRequestTypes.HOSPITAL]: {
    palette: {
      primary: {
        main: '#add8e6',
      },
    }
  },

  [ServiceRequestTypes.MECHANIC]: {
    palette: {
      primary: {
        main: '#595959',
      },
    }
  },

  [ServiceRequestTypes.TAXI]: {
    palette: {
      primary: {
        main: '#fb9403',
      },
    }
  },

  [ServiceRequestTypes.REPORTER]: {
    palette: {
      primary: {
        main: '#d4af37',
      },
    }
  }
}

export default theme;
