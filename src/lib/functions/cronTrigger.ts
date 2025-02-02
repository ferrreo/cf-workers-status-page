// import fetch from 'node-fetch'
import config from '../../config.json';

import {
  getCheckLocation,
  getKVMonitors,
  notifyDiscord,
  setKVMonitors
} from './helpers';

function getDate() {
  return new Date().toISOString().split('T')[0];
}

export async function processCronTrigger(env: App.Platform['env']) {

  // Get Worker PoP and save it to monitorsStateMetadata
  const checkLocation = await getCheckLocation();
  const checkDay = getDate();

  // Get monitors state from KV
  const _monitorsState = (await getKVMonitors(env)) || { lastUpdate: {}, monitors: {} };
  const monitorsState = _monitorsState as App.MonitorsState;

  // Reset default all monitors state to true
  monitorsState.lastUpdate.allOperational = true;

  for (const monitor of config.monitors) {
    // Create default monitor state if does not exist yet
    if (typeof monitorsState.monitors[monitor.id] === 'undefined') {
      monitorsState.monitors[monitor.id] = {
        firstCheck: checkDay,
        lastCheck: {
          status: 0, // fill empty data
          statusText: '',
          operational: false
        },
        checks: {}
      };
    }

    console.log(`Checking ${monitor.name} ...`);

    const init: RequestInit = {
      method: monitor.method || 'GET',
      redirect: monitor.followRedirect ? 'follow' : 'manual',
      headers: {
        'User-Agent': 'cf-worker-status-page'
      }
    };

    // Perform a check and measure time
    const requestStartTime = Date.now();
    const checkResponse = await fetch(monitor.url, init);
    const requestTime = Math.round(Date.now() - requestStartTime);

    // Determine whether operational and status changed
    const monitorOperational = checkResponse.status >= 200 && checkResponse.status < 400;
    const monitorStatusChanged =
      monitorsState.monitors[monitor.id].lastCheck.operational !== monitorOperational;

    // Save monitor's last check response status
    monitorsState.monitors[monitor.id].lastCheck = {
      status: checkResponse.status,
      statusText: checkResponse.statusText,
      operational: monitorOperational
    };

    // Send Discord message on monitor change
    if (monitorStatusChanged && env.SECRET_DISCORD_WEBHOOK_URL) {
      await notifyDiscord(env, monitor, monitorOperational);
    }

    // make sure checkDay exists in checks in cases when needed
    if (
      (config.settings.collectResponseTimes || !monitorOperational) &&
      // FIXME
      // eslint-disable-next-line no-prototype-builtins
      !monitorsState.monitors[monitor.id].checks.hasOwnProperty(checkDay)
    ) {
      monitorsState.monitors[monitor.id].checks[checkDay] = { fails: 0, res: {} };
    }

    if (config.settings.collectResponseTimes && monitorOperational) {
      // make sure location exists in current checkDay
      if (
        // FIXME
        // eslint-disable-next-line no-prototype-builtins
        !monitorsState.monitors[monitor.id].checks[checkDay].res.hasOwnProperty(checkLocation)
      ) {
        monitorsState.monitors[monitor.id].checks[checkDay].res[checkLocation] = {
          n: 0,
          ms: 0,
          a: 0
        };
      }

      // increment number of checks and sum of ms
      const no = ++monitorsState.monitors[monitor.id].checks[checkDay].res[checkLocation].n;
      const ms = (monitorsState.monitors[monitor.id].checks[checkDay].res[checkLocation].ms +=
        requestTime);

      // save new average ms
      monitorsState.monitors[monitor.id].checks[checkDay].res[checkLocation].a = Math.round(
        ms / no
      );
    } else if (!monitorOperational) {
      // Save allOperational to false
      monitorsState.lastUpdate.allOperational = false;

      // Increment failed checks on status change or first fail of the day (maybe call it .incidents instead?)
      if (monitorStatusChanged || monitorsState.monitors[monitor.id].checks[checkDay].fails == 0) {
        monitorsState.monitors[monitor.id].checks[checkDay].fails++;
      }
    }
  }

  // Save last update information
  monitorsState.lastUpdate.time = Date.now();
  monitorsState.lastUpdate.loc = checkLocation;

  // Save monitorsState to KV storage
  await setKVMonitors(env, monitorsState);

  return;
}
