import { processCronTrigger } from './cronTrigger';

export default class EUWestObject implements DurableObject {

  private state: DurableObjectState;
  private env: App.Platform['env'];

  constructor(state: DurableObjectState, env: App.Platform['env']) {
    this.state = state;
    this.env = env;
  }

  async fetch() {
    await processCronTrigger(this.env)
    return new Response("OK");
  }
}
