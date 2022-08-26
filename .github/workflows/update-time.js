const query = `mutation changeUserStatus ($input: ChangeUserStatusInput!) {
  changeUserStatus (input: $input) {
    status {
      emoji
      message
    }
  }
}`

const moment = require('moment-timezone')

function emojiClock(momentTimestamp, timezone) {
  // Hour as a decimal number using a 12-hour clock (range 1 to 12).
  let hour = momentTimestamp.format('h');
  hour = moment.utc(momentTimestamp).tz(timezone).format('h')
  console.log("EmojiClock Hour   : " + hour);

  // Minute as a decimal number (range 00 to 59).
  let minute = momentTimestamp.format('mm');
  minute = moment.utc(momentTimestamp).tz(timezone).format('mm')
  console.log("EmojiClock Minute : " + minute);

  // If minute is between 15 and 45, use the emoji clocks
  // that point at minute 30. For example: 🕦 or 🕝.
  let isNearHalfHour = minute > 15 && minute < 45;
  let thirtyMinutesOrBlank = isNearHalfHour ? "30" : "";

  //TODO: It shows previous hour only after 45-th minutes.

  // Return the clock emoji that most resembles the current time
  return `:clock${hour}${thirtyMinutesOrBlank}:`
}

const EmptySpaceString = " ";
const EmojiDivider = EmptySpaceString + "•─•°•❀•°•─•" + EmptySpaceString;
const TimeZoneEuropeOslo = "Europe/Oslo";
const EmojiNorway = ":norway:";

function getTimestamp(momentTimestamp, timezone) {
  var utcTimestamp = moment.utc(momentTimestamp).tz("UTC");
  console.log("UTC         : " + utcTimestamp.format());

  var timeZonedTimestamp = moment.utc(momentTimestamp).tz(timezone);
  console.log("Europe/Oslo : " + timeZonedTimestamp.format());

  console.log("Europe/Oslo Time: " + timeZonedTimestamp.format("HH:mm:ss"));
  console.log("Europe/Oslo Time: " + timeZonedTimestamp.format("LTS"));

  return timeZonedTimestamp.format("LT");
}

module.exports = async ({ github, context, core }) => {
  const momentTimestamp = moment(Date.now())
  console.log("UTC         : " + momentTimestamp.toISOString());

  return getTimestamp(momentTimestamp, TimeZoneEuropeOslo)
    + EmptySpaceString
    + emojiClock(momentTimestamp, TimeZoneEuropeOslo)
    + EmojiDivider
    + EmojiNorway;
}
