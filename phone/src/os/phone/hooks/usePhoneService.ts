import {useRecoilState, useSetRecoilState} from 'recoil';
import {PhoneEvents} from '@typings/phone';
import {phoneState} from './state';
import {useApps} from '@os/apps/hooks/useApps';
import {useCallback} from 'react';
import {useHistory} from 'react-router-dom';
import {useSnackbar} from '@os/snackbar/hooks/useSnackbar';
import {useNuiEvent} from '@common/hooks/useNuiEvent';
import fetchNui from "@utils/fetchNui";
import {isEnvBrowser} from "@utils/misc";

export const usePhoneService = () => {
  const {getApp} = useApps();
  const {addAlert} = useSnackbar();
  const history = useHistory();

  const setVisibility = useSetRecoilState(phoneState.visibility);
  const setResourceConfig = useSetRecoilState(phoneState.resourceConfig);
  const setPhoneTime = useSetRecoilState(phoneState.phoneTime);
  const setIsPhoneDisabled = useSetRecoilState(phoneState.isPhoneDisabled);
  const setPlayerSource = useSetRecoilState(phoneState.playerSource);
  const setPlayerIdentifier = useSetRecoilState(phoneState.playerIdentifier);
  const [playerJob, setPlayerJob] = useRecoilState(phoneState.playerJob);
  const [playerCompany, setPlayerCompany] = useRecoilState(phoneState.playerCompany);

  const handleOpenApp = useCallback(
    (app: string) => {
      // In case user passes us a lowercase string, lets uppercase it as all app IDs are
      // uppercase
      const foundApp = getApp(app.toUpperCase());

      if (!foundApp) return console.error(`App "${app}" is an invalid app id to open`);
      history.push(foundApp.path);
    },
    [getApp, history],
  );

  const handleSetVisibility = useCallback(
    (visibility: boolean) => {
      if (playerJob == null && playerCompany == null) {
        if (isEnvBrowser()) {
          setVisibility(visibility);
        } else {
          fetchNui(PhoneEvents.RETRIEVE_PLAYER_INFO).then(() => {
            setVisibility(visibility);
          });
        }
      } else {
        setVisibility(visibility);
      }
    }, [playerJob, playerCompany]
  )

  useNuiEvent('PHONE', PhoneEvents.ADD_SNACKBAR_ALERT, addAlert);
  useNuiEvent('PHONE', PhoneEvents.SET_VISIBILITY, handleSetVisibility);
  useNuiEvent('PHONE', PhoneEvents.SET_CONFIG, setResourceConfig);
  useNuiEvent('PHONE', PhoneEvents.SET_TIME, setPhoneTime);
  useNuiEvent<string>('PHONE', PhoneEvents.OPEN_APP, handleOpenApp);
  useNuiEvent('PHONE', PhoneEvents.IS_PHONE_DISABLED, setIsPhoneDisabled);
  useNuiEvent('PHONE', PhoneEvents.SEND_PLAYER_SOURCE, setPlayerSource);
  useNuiEvent('PHONE', PhoneEvents.SEND_PLAYER_IDENTIFIER, setPlayerIdentifier);
  useNuiEvent('PHONE', PhoneEvents.SET_PLAYER_JOB, setPlayerJob);
  useNuiEvent('PHONE', PhoneEvents.SET_PLAYER_COMPANY, setPlayerCompany);
};
