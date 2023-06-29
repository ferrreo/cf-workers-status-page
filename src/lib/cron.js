entry_default.scheduled = async (event, env, ctx) => {
  init_config();
  ctx.waitUntil(processCronTrigger(env));
};

var kvDataKey = 'monitors_data_v1_1';
