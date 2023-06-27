entry_default.scheduled = async (event, env, ctx) => {
  ctx.waitUntil(cron(env));
};

// Cron logic
async function cron(env) {
  console.log("Starting cron");
  processCronTrigger(env)
}
