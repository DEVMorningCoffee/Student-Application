const moment = require("moment");

class DateFormat {
  formatToISO(date) {
    return moment(date).toISOString();
  }

  formatToDateTime(date) {
    return moment(date).utc().format("YYYY-MM-DD");
  }
}

module.exports = { DateFormat };
