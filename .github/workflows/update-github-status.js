// Workaround: SyntaxError: Cannot use import statement outside a module.
// import { GitHubProfileStatus } from 'github-profile-status';
const { GitHubProfileStatus } = require('github-profile-status')

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const kaomojis = ['٩(◕‿◕)۶', '＼(〇_ｏ)／', '٩(× ×)۶', '(ᗒᗣᗕ)՞', 'ʕ •ᴥ• ʔ', 'ヽ(♡‿♡)ノ', '☆*:.｡.o(≧▽≦)o.｡.:*☆']
const emojis = ['🤿', '🌊', '🐡', '🐟', '🐠', '🐚', '🪸']
const dayIndex = (new Date()).getDay()
const limitedAvailabilityDayNames = new Set(["Saturday", "Sunday"]);

module.exports = async ({ github, context, core }) => {
  // https://github.com/wsmd/github-profile-status
  const profileStatus = new GitHubProfileStatus({
    token: process.env.USER_SCOPE_PERSONAL_ACCESS_TOKEN,
  });

  // https://github.com/wsmd/github-profile-status
  return await profileStatus.set({
    emoji: 'emojis[dayIndex]',
    message: "It's ${ dayNames[dayIndex]}! ${ kaomojis[dayIndex]}",
    limitedAvailability: limitedAvailabilityDayNames.has(dayNames[dayIndex]),
  });
}
