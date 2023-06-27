entry_default.scheduled = async (event, env, ctx) => {
  ctx.waitUntil(cron(env));
};

// Cron logic
async function cron(env) {
  console.log("Starting cron");
  processCronTrigger(env)
}

async function processCronTrigger(env) {
  // Get Worker PoP and save it to monitorsStateMetadata
  var checkLocation = await getCheckLocation()
  var checkDay = new Date().toISOString().split('T')[0]

  // Get monitors state from KV
  let monitorsState = await getKVMonitors()

  // Create empty state objects if not exists in KV storage yet
  if (!monitorsState) {
    monitorsState = { lastUpdate: {}, monitors: {} }
  }

  // Reset default all monitors state to true
  monitorsState.lastUpdate.allOperational = true

  for (var monitor of config.monitors) {
    // Create default monitor state if does not exist yet
    if (typeof monitorsState.monitors[monitor.id] === 'undefined') {
      monitorsState.monitors[monitor.id] = {
        firstCheck: checkDay,
        lastCheck: {},
        checks: {},
      }
    }

    console.log(`Checking ${monitor.name} ...`)

    // Fetch the monitors URL
    var init = {
      method: monitor.method || 'GET',
      redirect: monitor.followRedirect ? 'follow' : 'manual',
      headers: {
        'User-Agent': 'cf-worker-status-page',
      },
    }

    // Perform a check and measure time
    var requestStartTime = Date.now()
    var checkResponse = await fetch(monitor.url, init)
    var requestTime = Math.round(Date.now() - requestStartTime)

    // Determine whether operational and status changed
    var monitorOperational =
      checkResponse.status === (monitor.expectStatus || 200)
    var monitorStatusChanged =
      monitorsState.monitors[monitor.id].lastCheck.operational !==
      monitorOperational

    // Save monitor's last check response status
    monitorsState.monitors[monitor.id].lastCheck = {
      status: checkResponse.status,
      statusText: checkResponse.statusText,
      operational: monitorOperational,
    }

    // Send Discord message on monitor change
    if (
      monitorStatusChanged &&
      typeof env.SECRET_DISCORD_WEBHOOK_URL !== 'undefined' &&
      env.SECRET_DISCORD_WEBHOOK_URL !== 'default-gh-action-secret'
    ) {
      await notifyDiscord(monitor, monitorOperational)
    }

    // make sure checkDay exists in checks in cases when needed
    if (
      (config.settings.collectResponseTimes || !monitorOperational) &&
      !monitorsState.monitors[monitor.id].checks.hasOwnProperty(checkDay)
    ) {
      monitorsState.monitors[monitor.id].checks[checkDay] = {
        fails: 0,
        res: {},
      }
    }

    if (config.settings.collectResponseTimes && monitorOperational) {
      // make sure location exists in current checkDay
      if (
        !monitorsState.monitors[monitor.id].checks[checkDay].res.hasOwnProperty(
          checkLocation,
        )
      ) {
        monitorsState.monitors[monitor.id].checks[checkDay].res[
          checkLocation
        ] = {
          n: 0,
          ms: 0,
          a: 0,
        }
      }

      // increment number of checks and sum of ms
      var no = ++monitorsState.monitors[monitor.id].checks[checkDay].res[
        checkLocation
      ].n
      var ms = (monitorsState.monitors[monitor.id].checks[checkDay].res[
        checkLocation
      ].ms += requestTime)

      // save new average ms
      monitorsState.monitors[monitor.id].checks[checkDay].res[
        checkLocation
      ].a = Math.round(ms / no)
    } else if (!monitorOperational) {
      // Save allOperational to false
      monitorsState.lastUpdate.allOperational = false

      // Increment failed checks on status change or first fail of the day (maybe call it .incidents instead?)
      if (monitorStatusChanged || monitorsState.monitors[monitor.id].checks[checkDay].fails == 0) {
        monitorsState.monitors[monitor.id].checks[checkDay].fails++
      }
    }
  }

  // Save last update information
  monitorsState.lastUpdate.time = Date.now()
  monitorsState.lastUpdate.loc = checkLocation

  // Save monitorsState to KV storage
  await setKVMonitors(monitorsState)

  return new Response('OK')
}

var kvDataKey = 'monitors_data_v1_1';

async function getKVMonitors(env) {
  // trying both to see performance difference
  return await env.KV_STATUS_PAGE.get(kvDataKey, 'json');
  //return JSON.parse(await KV_STATUS_PAGE.get(kvDataKey, 'text'))
}

async function setKVMonitors(env, data) {
  return setKV(env, kvDataKey, JSON.stringify(data), undefined, undefined);
}

var getOperationalLabel = (operational) => {
  return operational
    ? config.settings.monitorLabelOperational
    : config.settings.monitorLabelNotOperational;
};

async function setKV(env, key, value, metadata, expirationTtl) {
  return env.KV_STATUS_PAGE.put(key, value, { metadata, expirationTtl });
}

async function notifyDiscord(env, monitor, operational) {
  if (!env.SECRET_DISCORD_WEBHOOK_URL) {
    console.error('SECRET_DISCORD_WEBHOOK_URL is not set');
    return;
  }
  var payload = {
    username: `${config.settings.title}`,
    avatar_url: `${config.settings.url}/${config.settings.logo}`,
    embeds: [
      {
        title: `${monitor.name} is ${getOperationalLabel(operational)} ${
          operational ? ':white_check_mark:' : ':x:'
        }`,
        description: `\`${monitor.method ? monitor.method : 'GET'} ${
          monitor.url
        }\` - :eyes: [Status Page](${config.settings.url})`,
        color: operational ? 3581519 : 13632027,
      },
    ],
  }
  return fetch(env.SECRET_DISCORD_WEBHOOK_URL, {
    body: JSON.stringify(payload),
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
}

async function getCheckLocation() {
  var res = await fetch('https://cloudflare-dns.com/dns-query', {
    method: 'OPTIONS'
  });
  return res.headers?.get('cf-ray')?.split('-')[1];
}

var config = {
  "settings": {
    "title": "PikaOS Status",
    "url": "https://status.pika-os.com",
    "logo": "logo-192x192.png",
    "daysInHistogram": 90,
    "collectResponseTimes": true,
    "allMonitorsOperational": "All Systems Operational",
    "notAllMonitorsOperational": "Not All Systems Operational",
    "monitorLabelOperational": "Operational",
    "monitorLabelNotOperational": "Not Operational",
    "monitorLabelNoData": "No data",
    "dayInHistogramNoData": "No data",
    "dayInHistogramOperational": "All good",
    "dayInHistogramNotOperational": " incident(s)"
  },
  "monitors": [
    {
      "id": "pikaos-website",
      "name": "pika-os.com",
      "description": "PikaOS Site",
      "url": "https://pika-os.com/",
      "method": "GET",
      "expectStatus": 200,
      "followRedirect": false,
      "linkable": true
    },
    {
      "id": "ppa-pika-os-com",
      "name": "ppa.pika-os.com",
      "description": "PikaOS Package Repo",
      "url": "https://ppa.pika-os.com/",
      "method": "GET",
      "expectStatus": 200,
      "linkable": false
    },
    {
      "id": "iso-pika-os-com",
      "name": "iso-pika-os.com",
      "description": "PikaOS ISO Repo",
      "url": "https://iso.pika-os.com/",
      "method": "GET",
      "expectStatus": 200,
      "linkable": false
    }
  ]
};
