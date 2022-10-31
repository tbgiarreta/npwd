import defaultConfig from '../../../config.default.json';
import actualConfig from '../../../config.json';
import { ResourceConfig } from '@typings/config';
import { getResourceName, isEnvBrowser } from './misc';
import { deepMergeObjects } from '@shared/deepMergeObjects';

export const fetchConfig = async (): Promise<ResourceConfig> => {
  const resourceName = getResourceName();

  let config = actualConfig;

  if (!isEnvBrowser()) {

    config = await fetch(`https://cfx-nui-${resourceName}/config.json`)
      .then(async (res) => {
        return await res.json();
      })
      .catch((err) => {
        console.error('Could not find a config file!', err);
      });
  }

  return deepMergeObjects({}, defaultConfig, config);
};
