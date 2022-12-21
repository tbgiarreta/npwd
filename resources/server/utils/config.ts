import {ResourceConfig} from '../../../typings/config';
import defaultConfig from '../../../config.default.json';
import {deepMergeObjects} from '@shared/deepMergeObjects';
import path from "path";

export const getConfig = (): ResourceConfig => {
  if (typeof(GetCurrentResourceName) != 'undefined') {
    const resourceName = GetCurrentResourceName();
    const config: ResourceConfig = JSON.parse(LoadResourceFile(resourceName, 'config.json'));
    return deepMergeObjects({}, defaultConfig, config);
  } else {
    return require(path.resolve(__dirname, '..', '..', '..', 'config.json'));
  }
};
