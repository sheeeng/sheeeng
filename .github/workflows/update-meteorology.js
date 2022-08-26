const moment = require('moment-timezone')
const fetch = require("node-fetch");
const txml = require('txml')

let customHeader = new fetch.Headers();
customHeader.append('Accept', 'application/xml');
customHeader.append('Content-Type', 'text/xml');
customHeader.append('User-Agent', 'github.com/sheeeng leonard.sheng.sheng.lee@gmail.com');



function curlMeteorologyData() {
  fetch('https://api.met.no/weatherapi/sunrise/2.0/\?lat\=59.933333\&lon\=10.716667\&date\=2022-08-25\&offset\=+02:00',
    {
      method: 'GET',
      headers: customHeader
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
      const meteorologyXmlData = data
      console.log("XML : " + meteorologyXmlData)

      const parsedXml = txml.parse(meteorologyXmlData)
      console.log("\ntxml.parse(meteorologyXmlData):\n\n" + parsedXml)

      const stringifiedJson = JSON.stringify(parsedXml)
      console.log("\nJSON.stringify(parsedXml):\n\n" + stringifiedJson)

      const parsedJson = JSON.parse(stringifiedJson)
      console.log("\nJSON.parse(stringifiedJson):\n\n" + parsedJson)

      const meteorologyJsonData = JSON.parse(JSON.stringify(txml.parse(meteorologyXmlData)))
      console.log("LAST JSON : " + JSON.stringify(meteorologyJsonData[1]))

      return meteorologyJsonData
    });
}

// https://stackoverflow.com/questions/1773550/convert-xml-to-json-and-back-using-javascript/1773571#1773571
// https://goessner.net/download/prj/jsonxml/
// https://www.xml.com/pub/a/2006/05/31/converting-between-xml-and-json.html

//TODO: Check DST is currently applied. E.g. Central European Summer Time (CEST) or Central European Time (CET)?

const EmptySpaceString = " ";
const EmojiDivider = EmptySpaceString + "•─•°•❀•°•─•" + EmptySpaceString;

module.exports = async ({ github, context, core }) => {
  const momentTimestamp = moment(Date.now())
  console.log("UTC         : " + momentTimestamp.toISOString());

  return curlMeteorologyData()
}
