const { helloTask } = require("./taskServices");
const { CronJob } = require("cron");

const everyMinute = new CronJob(
    "* * * * *",
    helloTask,
    null,
    true
)
module.exports = { everyMinute }