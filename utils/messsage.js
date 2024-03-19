const moment = require("moment");

let local = moment().local();

function formatmsg(username, message) {
  return {
    username,
    message,
    time: local.format("h:mm a"),
  };
}

module.exports = formatmsg;
