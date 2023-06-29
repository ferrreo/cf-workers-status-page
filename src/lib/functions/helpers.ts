// import fetch from 'node-fetch'
import config from '../../config.json';



type ENV = App.Platform['env'];

export async function getKVMonitors(env: ENV): Promise<JSON | null> {
  return await env.KV_STATUS_PAGE.get('monitors_data_v1_1', 'json');
}

export async function setKVMonitors(env: ENV, data: JSON) {
  return setKV(env, 'monitors_data_v1_1', JSON.stringify(data), undefined, undefined);
}

async function setKV(
  env: ENV,
  key: string,
  value: string | ArrayBuffer | ArrayBufferView | ReadableStream<any>,
  metadata: KVNamespacePutOptions['metadata'],
  expirationTtl?: number
) {
  return env.KV_STATUS_PAGE.put(key, value, { metadata, expirationTtl });
}

// Visualize your payload using https://leovoel.github.io/embed-visualizer/
export async function notifyDiscord(env: ENV, monitor: App.MonitorConfig, operational: boolean) {
  if (!env.SECRET_DISCORD_WEBHOOK_URL) {
    console.error('SECRET_DISCORD_WEBHOOK_URL is not set');
    return;
  }
  const payload = {
    username: `${config.settings.title}`,
    avatar_url: `${config.settings.url}/${config.settings.logo}`,
    embeds: [
      {
        title: `${monitor.name} is ${operational ? config.settings.monitorLabelOperational
          : config.settings.monitorLabelNotOperational} ${
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

export async function getCheckLocation() {
  const res = await fetch('https://cloudflare-dns.com/dns-query', {
    method: 'OPTIONS'
  });
  return res.headers?.get('cf-ray')?.split('-')[1] || "";
}
