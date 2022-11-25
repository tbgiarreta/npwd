import { atom } from 'recoil';
import { ResourceConfig } from '@typings/config';
import {PlayerJob} from "@typings/job";
import {PlayerCompany} from "@typings/company";

export const phoneState = {
  visibility: atom<boolean>({
    key: 'phoneVisibility',
    default: false,
  }),
  resourceConfig: atom<ResourceConfig>({
    key: 'resourceConfig',
    default: null,
  }),
  phoneTime: atom<string>({
    key: 'phoneTime',
    default: null,
  }),
  isPhoneDisabled: atom<boolean>({
    key: 'isPhoneDisabled',
    default: false,
  }),
  playerSource: atom<string>({
    key: 'playerSource',
    default: '0',
  }),
  playerIdentifier: atom<number>({
    key: 'playerIdentifier',
    default: 0,
  }),
  extApps: atom({
    key: 'phoneExtApps',
    default: [],
  }),
  playerJob: atom<PlayerJob>({
    key: 'playerJob',
    default: null
  }),
  playerCompany: atom<PlayerCompany>({
    key: 'playerCompany',
    default: null
  }),
};
