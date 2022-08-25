const query = `mutation changeUserStatus ($input: ChangeUserStatusInput!) {
  changeUserStatus (input: $input) {
    status {
      emoji
      message
    }
  }
}`

const moment = require('moment')

function emojiClock(momentTimestamp) {
  // Hour as a decimal number using a 12-hour clock (range 1 to 12).
  let hour = momentTimestamp.format('h');

  // Minute as a decimal number (range 00 to 59).
  let minute = momentTimestamp.format('mm');

  // If minute is between 15 and 45, use the emoji clocks
  // that point at minute 30. For example: 🕦 or 🕝.
  let isNearHalfHour = minute > 15 && minute < 45;
  let thirtyMinutesOrBlank = isNearHalfHour ? "30" : "";

  // Return the clock emoji that most resembles the current time
  `:clock${hour}${thirtyMinutesOrBlank}:`
}

module.exports = async ({ github, context, core }) => {
  let momentTimestamp = moment(Date.now())
  return momentTimestamp.toISOString() + emojiClock(momentTimestamp) + "•───•°•❀•°•───•" + " :norway: ";
}
