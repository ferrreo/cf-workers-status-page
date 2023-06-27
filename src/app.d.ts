// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}

    interface Platform {
      env: {
        KV_STATUS_PAGE: KVNamespace;
        SECRET_TELEGRAM_CHAT_ID?: string;
        SECRET_TELEGRAM_API_TOKEN?: string;
        SECRET_DISCORD_WEBHOOK_URL?: string;
      };
      context: {
        waitUntil(promise: Promise<any>): void;
      };
      caches: CacheStore & {
        default: Cache;
      };
    }

    interface MonitorConfig {
      id: string;
      name: string;
      url: string;
      method: string;
      expectStatus: number;
      description?: string;
      followRedirects?: boolean;
      linkable?: boolean;
    }

    interface Config {
      settings: {
        [key: string]: unknown;
      };
      monitors: MonitorConfig[];
    }

    interface Monitor {
      firstCheck: string;
      lastCheck: {
        status: number;
        statusText: string;
        operational: boolean;
      };
      checks: {
        [key: string]: {
          fails: number;
          res: {
            [key: string]: {
              n: number;
              ms: number;
              a: number;
            };
          };
        };
      };
    }

    interface MonitorsState extends JSON {
      lastUpdate: {
        allOperational: boolean;
        time: number;
        loc: string;
      };
      monitors: {
        [key: string]: Monitor;
      };
    }
  }
}

export {};
