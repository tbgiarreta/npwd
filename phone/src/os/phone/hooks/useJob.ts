import {useRecoilValue} from "recoil";
import {phoneState} from "@os/phone/hooks/state";

export const useJob = () => {
  return useRecoilValue(phoneState.playerJob);
}