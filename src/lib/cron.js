entry_default.scheduled = async (event, env, ctx) => {
  ctx.waitUntil(processCronTrigger(env));
};

var kvDataKey = 'monitors_data_v1_1';

var getOperationalLabel = (operational) => {
  return operational
    ? config.settings.monitorLabelOperational
    : config.settings.monitorLabelNotOperational;
};
