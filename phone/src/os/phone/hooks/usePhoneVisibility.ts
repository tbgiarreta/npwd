import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { useSettings } from '../../../apps/settings/hooks/useSettings';
import { phoneState } from './state';

export const usePhoneVisibility = () => {
  const visibility = useRecoilValue(phoneState.visibility);
  const [{ zoom }] = useSettings();

  const bottom = useMemo(() => {
    if (!visibility) {
      return `${-750 * zoom.value}px`;
    }
    return '0px';
  }, [visibility, zoom]);

  return {
    bottom,
    visibility: visibility,
  };
};
