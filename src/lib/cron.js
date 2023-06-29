entry_default.scheduled = async (event, env, ctx) => {
  ctx.waitUntil(processCronTrigger(env));
};

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

export class EUWestObject {

  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const data = await processCronTrigger(this.env, null, false, "West Europe")
    return new Response(data);
  }
}

export class WNAMObject {

  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const url = new URL(request.url);
    const inputData = url.searchParams.get("data");
    const data = await processCronTrigger(this.env, inputData, false, "West North America")
    return new Response(data);
  }
}

export class ENAMObject {

  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const url = new URL(request.url);
    const inputData = url.searchParams.get("data");
    const data = await processCronTrigger(this.env, inputData, false, "East North America")
    return new Response(data);
  }
}

export class SAMObject {

  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const url = new URL(request.url);
    const inputData = url.searchParams.get("data");
    const data = await processCronTrigger(this.env, inputData, false, "South America")
    return new Response(data);
  }
}

export class EEURObject {

  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const url = new URL(request.url);
    const inputData = url.searchParams.get("data");
    const data = await processCronTrigger(this.env, inputData, false, "East Europe")
    return new Response(data);
  }
}

export class APACObject {

  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const url = new URL(request.url);
    const inputData = url.searchParams.get("data");
    const data = await processCronTrigger(this.env, inputData, false, "Asia Pacific")
    return new Response(data);
  }
}

export class OCObject {

  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const url = new URL(request.url);
    const inputData = url.searchParams.get("data");
    const data = await processCronTrigger(this.env, inputData, false, "Oceana")
    return new Response(data);
  }
}

export class AFRObject {

  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const url = new URL(request.url);
    const inputData = url.searchParams.get("data");
    const data = await processCronTrigger(this.env, inputData, false, "Africa")
    return new Response(data);
  }
}

export class MEObject {

  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const url = new URL(request.url);
    const inputData = url.searchParams.get("data");
    const data = await processCronTrigger(this.env, inputData, true, "Middle East")
    return new Response(data);
  }
}
