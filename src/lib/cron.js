entry_default.scheduled = async (event, env, ctx) => {
  ctx.waitUntil(processCronTrigger(env));
};
