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
const emojis = ['😊', '🥺', '🤔', '😣', '🐻', '😍', '🥰']
const dayIndex = (new Date()).getDay()
const limitedAvailabilityDayNames = new Set(["Friday", "Saturday", "Sunday"]);
var hasLimitedAvailability = false;
if (limitedAvailabilityDayNames.has(dayNames[dayIndex])) {
  limitedAvailability = true;
}

github.graphql(query, {
  input: {
    emoji: `${emojis[dayIndex]}`,
    message: `It's ${dayNames[dayIndex]}! ${kaomojis[dayIndex]}`,
    limitedAvailability: `${hasLimitedAvailability}`
  }
})
