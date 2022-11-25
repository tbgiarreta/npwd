import {useRecoilValue} from "recoil";
import {phoneState} from "@os/phone/hooks/state";

export const useCompany = () => {
  return useRecoilValue(phoneState.playerCompany);
}