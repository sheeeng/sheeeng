const query = `mutation changeUserStatus ($input: ChangeUserStatusInput!) {
  changeUserStatus (input: $input) {
    status {
      emoji
      message
    }
  }
}`

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const kaomojis = ['٩(◕‿◕)۶', '＼(〇_ｏ)／', '٩(× ×)۶', '(ᗒᗣᗕ)՞', 'ʕ •ᴥ• ʔ', 'ヽ(♡‿♡)ノ', '☆*:.｡.o(≧▽≦)o.｡.:*☆']
// const emojis = ['😊', '🥺', '🤔', '😣', '🐻', '😍', '🥰']
const emojis = ['🤿', '🌊', '🐡', '🐟', '🐠', '🐚', '🪸']
const limitedAvailabilityDayNames = new Set(["Saturday", "Sunday"]);

const dayIndex = (new Date()).getDay();
const emojiStatus = emojis[dayIndex];
const dayNameStatus = dayNames[dayIndex];
const kaomojiStatus = kaomojis[dayIndex];
const messageStatus = "It's " + dayNameStatus + "! " + kaomojiStatus;
const limitedAvailabilityStatus = limitedAvailabilityDayNames.has(dayNames[dayIndex]);

console.log("Date : " + new Date());
console.log("DayIndex : " + dayIndex);
console.log("DayName : " + dayNameStatus);
console.log("Emoji : " + emojiStatus);
console.log("Kaomoji : " + kaomojiStatus);
console.log("Message : " + messageStatus);
console.log("LimitedAvailability : " + limitedAvailabilityStatus);

module.exports = async ({ github, context, core }) => {
  // https://docs.github.com/en/graphql/reference/input-objects#changeuserstatusinput
  return github.graphql(query, {
    input: {
      emoji: `${emojiStatus}`,
      message: `It's ${dayNameStatus}! ${kaomojiStatus}`,
      limitedAvailability: limitedAvailabilityStatus
    }
  })
}
