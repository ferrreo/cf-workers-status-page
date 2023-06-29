entry_default.scheduled = async (event, env, ctx) => {
  let url = new URL("https://status.pika-os.com");
  var id = env.EUWEST.idFromName("EUWEST");
  var obj = env.EUWEST.get(id, { locationHint: "weur" });
  var data = await obj.fetch(url);
  url.searchParams.set("data", data);
  id = env.WNAM.idFromName("WNAM");
  obj = env.WNAM.get(id, { locationHint: "wnam" });
  data = await obj.fetch(url);
  url.searchParams.set("data", data);
  id = env.ENAM.idFromName("ENAM");
  obj = env.ENAM.get(id, { locationHint: "enam" });
  data = await obj.fetch(url);
  url.searchParams.set("data", data);
  id = env.SAM.idFromName("SAM");
  obj = env.SAM.get(id, { locationHint: "sam" });
  data = await obj.fetch(url);
  url.searchParams.set("data", data);
  id = env.EEUR.idFromName("EEUR");
  obj = env.EEUR.get(id, { locationHint: "eeur" });
  data = await obj.fetch(url);
  url.searchParams.set("data", data);
  id = env.APAC.idFromName("APAC");
  obj = env.APAC.get(id, { locationHint: "apac" });
  data = await obj.fetch(url);
  url.searchParams.set("data", data);
  id = env.OC.idFromName("OC");
  obj = env.OC.get(id, { locationHint: "oc" });
  data = await obj.fetch(url);
  url.searchParams.set("data", data);
  id = env.AFR.idFromName("AFR");
  obj = env.AFR.get(id, { locationHint: "afr" });
  data = await obj.fetch(url);
  url.searchParams.set("data", data);
  id = env.ME.idFromName("ME");
  obj = env.ME.get(id, { locationHint: "me" });
  data = ctx.waitUntil(obj.fetch(url));
};


export class EUWestObject {

  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const data = await processCronTrigger(this.env)
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
    const data = await processCronTrigger(this.env, inputData)
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
    const data = await processCronTrigger(this.env, inputData)
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
    const data = await processCronTrigger(this.env, inputData)
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
    const data = await processCronTrigger(this.env, inputData)
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
    const data = await processCronTrigger(this.env, inputData)
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
    const data = await processCronTrigger(this.env, inputData)
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
    const data = await processCronTrigger(this.env, inputData)
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
    const data = await processCronTrigger(this.env, inputData, true)
    return new Response(data);
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
