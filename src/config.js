import { flatten, groupBy, keys, values } from 'lodash';

const config = require('./config.json');


let initialized = false;
let moduleSettings = {};
let platforms = {};
let platform = {};
let displayPlatforms = {};

let obj = {
  get settings() {
    return {
      initialized,
      ...config,
      ...moduleSettings,
      platforms,
      platform,
      displayPlatforms
    }
  },
  set settings(settings) {
    initialized = true;
    moduleSettings = settings;

    if (settings.platforms) {
      platforms = settings.platforms
        ? settings.platforms
        : groupBy(value => value, settings.platform.split(','));
      platform = flatten(values(settings.platforms)).join(',');
      displayPlatforms = keys(settings.platforms);
    }
  }
}

export default obj;