const moment = require('moment-timezone')

let headers = new Headers({
  "Accept": "application/xml",
  "Content-Type": "application/xml",
  'User-Agent': 'github.com/sheeeng leonard.sheng.sheng.lee@gmail.com'
});

let meteorologyXmlData;

function curlMeteorologyData() {
  fetch('https://api.met.no/weatherapi/sunrise/2.0/\?lat\=59.933333\&lon\=10.716667\&date\=2022-08-25\&offset\=+02:00',
    {
      method: 'GET',
      headers: headers
    })
    // .then((response) => response.json())
    // .then((data) => console.log(data));
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      } else {
        console.log("Response : " + response)
      }
      return response.text();
    })
    .then((data) => {
      meteorologyXmlData = data
      console.log("Data : " + data)
    });

  // TODO: Convert XML to JSON.
  // TODO: Parse JSON data.
  // TODO: Extract location, date, moonphase, moonrise, high_moon, low_moon, moonset, sunrise, solarnoon, sunset.
}

//TODO: Check DST is currently applied. E.g. Central European Summer Time (CEST) or Central European Time (CET)?

const EmptySpaceString = " ";
const EmojiDivider = EmptySpaceString + "•─•°•❀•°•─•" + EmptySpaceString;

module.exports = async ({ github, context, core }) => {
  const momentTimestamp = moment(Date.now())
  console.log("UTC         : " + momentTimestamp.toISOString());

  return curlMeteorologyData()
}
