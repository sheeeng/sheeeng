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
const dayIndex = (new Date()).getDay()
const limitedAvailabilityDayNames = new Set(["Saturday", "Sunday"]);

console.log("Date : " + new Date())
console.log("DayIndex : " + dayIndex)
console.log("DayName : " + dayNames[dayIndex])
console.log("Kaomoji : " + kaomojis[dayIndex])
console.log("LimitedAvailability : " + limitedAvailabilityDayNames.has(dayNames[dayIndex]))

module.exports = async ({ github, context, core }) => {
  // https://docs.github.com/en/graphql/reference/input-objects#changeuserstatusinput
  return github.graphql(query, {
    input: {
      emoji: `${emojis[dayIndex]}`,
      message: `It's ${dayNames[dayIndex]}! ${kaomojis[dayIndex]}`,
      limitedAvailability: limitedAvailabilityDayNames.has(dayNames[dayIndex])
    }
  })
}
