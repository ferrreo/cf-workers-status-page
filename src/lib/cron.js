entry_default.scheduled = async (event, env, ctx) => {
  var id = env.EUWEST.idFromName("EUWEST");
  var obj = env.EUWEST.get(id, { locationHint: "weur" });
  ctx.waitUntil(obj.fetch("https://status.pika-os.com"));
  id = env.WNAM.idFromName("WNAM");
  obj = env.WNAM.get(id, { locationHint: "wnam" });
  ctx.waitUntil(obj.fetch("https://status.pika-os.com"));
  id = env.ENAM.idFromName("ENAM");
  obj = env.ENAM.get(id, { locationHint: "enam" });
  ctx.waitUntil(obj.fetch("https://status.pika-os.com"));
  id = env.SAM.idFromName("SAM");
  obj = env.SAM.get(id, { locationHint: "sam" });
  ctx.waitUntil(obj.fetch("https://status.pika-os.com"));
  id = env.EEUR.idFromName("EEUR");
  obj = env.EEUR.get(id, { locationHint: "eeur" });
  ctx.waitUntil(obj.fetch("https://status.pika-os.com"));
  id = env.APAC.idFromName("APAC");
  obj = env.APAC.get(id, { locationHint: "apac" });
  ctx.waitUntil(obj.fetch("https://status.pika-os.com"));
  id = env.OC.idFromName("OC");
  obj = env.OC.get(id, { locationHint: "oc" });
  ctx.waitUntil(obj.fetch("https://status.pika-os.com"));
  id = env.AFR.idFromName("AFR");
  obj = env.AFR.get(id, { locationHint: "afr" });
  ctx.waitUntil(obj.fetch("https://status.pika-os.com"));
  id = env.ME.idFromName("ME");
  obj = env.ME.get(id, { locationHint: "me" });
  ctx.waitUntil(obj.fetch("https://status.pika-os.com"));
};


export class EUWestObject {

  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    await processCronTrigger(this.env)
    return new Response("OK");
  }
}

export class WNAMObject {

  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    await processCronTrigger(this.env)
    return new Response("OK");
  }
}

export class ENAMObject {

  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    await processCronTrigger(this.env)
    return new Response("OK");
  }
}

export class SAMObject {

  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    await processCronTrigger(this.env)
    return new Response("OK");
  }
}

export class EEURObject {

  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    await processCronTrigger(this.env)
    return new Response("OK");
  }
}

export class APACObject {

  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    await processCronTrigger(this.env)
    return new Response("OK");
  }
}

export class OCObject {

  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    await processCronTrigger(this.env)
    return new Response("OK");
  }
}

export class AFRObject {

  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    await processCronTrigger(this.env)
    return new Response("OK");
  }
}

export class MEObject {

  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
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
