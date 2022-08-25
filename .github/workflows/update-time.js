const query = `mutation changeUserStatus ($input: ChangeUserStatusInput!) {
  changeUserStatus (input: $input) {
    status {
      emoji
      message
    }
  }
}`

function emojiClock(time) {
  // Hour as a decimal number using a 12-hour clock (range 1 to 12).
  let hour = time.strftime("%l").toI;

  // Minute as a decimal number (range 00 to 59).
  let minute = time.strftime("%M").toI;

  // If minute is between 15 and 45, use the emoji clocks
  // that point at minute 30. For example: 🕦 or 🕝.
  let isNearHalfHour = minute > 15 && minute < 45;
  let thirtyMinutesOrBlank = isNearHalfHour ? "30" : "";

  // Return the clock emoji that most resembles the current time
  `:clock${hour}${thirtyMinutesOrBlank}:`
}

module.exports = async ({ github, context, core }) => {
  let time = Time.now
  return time.strftime("It's %l:%M%P in :norway:.") + "•───•°•❀•°•───•" + emojiClock(time);
}
