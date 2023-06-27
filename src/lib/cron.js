entry_default.scheduled = async (event, env, ctx) => {
  ctx.waitUntil(processCronTrigger(env));
};

var kvDataKey = 'monitors_data_v1_1';

var getOperationalLabel = (operational) => {
  return operational
    ? config.settings.monitorLabelOperational
    : config.settings.monitorLabelNotOperational;
};

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
