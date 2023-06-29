entry_default.scheduled = async (event, env, ctx) => {
  var id = env.EUWEST.idFromName("EUWEST");
  var obj = env.EUWEST.get(id, { locationHint: 'weur' });
  ctx.waitUntil(obj.fetch("", {}));
};

export class EUWestObject {

  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch() {
    await processCronTrigger(this.env)
    return new Response("OK");
  }
}

var kvDataKey = 'monitors_data_v1_1';

var getOperationalLabel = (operational) => {
  return operational
    ? config.settings.monitorLabelOperational
    : config.settings.monitorLabelNotOperational;
};

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
      "url": "https://iso.pika-os.com/?chk=1",
      "method": "GET",
      "expectStatus": 200,
      "linkable": false
    }
  ]
};
