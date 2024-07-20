const cron = require("node-cron");
const { BookingService } = require("../../services");

function scheduleCron() {
  cron.schedule("*/30 * * * *", async () => {
    await BookingService.cancelOldBookings();
  });
}

module.exports = scheduleCron;
