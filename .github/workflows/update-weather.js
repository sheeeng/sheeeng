const Mustache = require('mustache');
const fetch = require('node-fetch');
const { Headers } = require('node-fetch');
const fs = require('fs');
const { Duration, DateTime } = require("luxon");

const MUSTACHE_MAIN_DIR = './main.mustache';

let DATA = {
  refresh_date: new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short',
    timeZone: 'Europe/Oslo',
  }),
};

async function fetchMeteorologySunData() {
  let meteorologyHeaders = new Headers({
    'User-Agent': 'github.com/sheeeng 305414+sheeeng@users.noreply.github.com',
  });

  // https://stackoverflow.com/questions/37693982/how-to-fetch-xml-with-fetch-api/41009103#41009103
  // https://gist.github.com/prof3ssorSt3v3/61ccf69758cd6dbdc429934564864650
  // https://stackoverflow.com/questions/11398419/trying-to-use-the-domparser-with-node-js/55668667#55668667

  let dataAsJson = {};

  const currentDate = new Date().toISOString().substring(0, 10);
  console.log("Current Date: " + currentDate);

  await fetch(
    `https://api.met.no/weatherapi/sunrise/3.0/sun?lat=59.933333&lon=10.716667&date=${currentDate}&offset=+02:00`,
    { method: 'GET', headers: meteorologyHeaders }
  )
    .then(response => response.text())
    .then(xmlString => {
      dataAsJson = JSON.parse(xmlString)
    })
    .then(() => {
      // https://docs.api.met.no/doc/formats/SunriseJSON.html
      console.log(dataAsJson.properties) // properties
      console.log("~~~~ Sun ~~~~")
      console.log(dataAsJson.properties.sunrise.time)
      console.log("~~~~ Sun ~~~~")
      console.log(dataAsJson.properties.sunset.time)
      console.log("~~~~ Sun ~~~~")
      console.log(dataAsJson.properties.solarnoon.time)
      console.log("~~~~ Sun ~~~~")
      console.log(dataAsJson.properties.solarmidnight.time)
      console.log("~~~~ Sun ~~~~")
    })
    .then(() => {
      DATA.sunrise_time = dataAsJson.properties.sunrise.time
      console.log("Sunrise: " + DATA.sunrise_time)

      DATA.sunset_time = dataAsJson.properties.sunset.time
      console.log("Sunset: " + DATA.sunset_time)

      let sunriseMoment = DateTime.fromISO(DATA.sunrise_time)
      console.log("Sunrise Moment : " + sunriseMoment.toISO());
      let sunsetMoment = DateTime.fromISO(DATA.sunset_time)
      console.log("Sunset Moment  : " + sunsetMoment.toISO());

      let daylightDiff = sunsetMoment.diff(sunriseMoment, ['hours', 'minutes', 'seconds']).toObject()
      console.log("Daylight Diff : " + daylightDiff);

      let daylightDuration = Duration.fromObject(daylightDiff);
      console.log("Daylight Duration : " + daylightDuration.toHuman({ unitDisplay: 'long', listStyle: "long" }));

      DATA.daylight_duration = daylightDuration.toHuman({ unitDisplay: 'long', listStyle: "long" });
      console.log("Daylight Duration : " + DATA.daylight_duration);
    });
}

async function fetchMeteorologyMoonData() {
  let meteorologyHeaders = new Headers({
    'User-Agent': 'github.com/sheeeng 305414+sheeeng@users.noreply.github.com',
  });

  // https://stackoverflow.com/questions/37693982/how-to-fetch-xml-with-fetch-api/41009103#41009103
  // https://gist.github.com/prof3ssorSt3v3/61ccf69758cd6dbdc429934564864650
  // https://stackoverflow.com/questions/11398419/trying-to-use-the-domparser-with-node-js/55668667#55668667

  let dataAsJson = {};

  const currentDate = new Date().toISOString().substring(0, 10);
  console.log("Current Date: " + currentDate);

  await fetch(
    `https://api.met.no/weatherapi/sunrise/3.0/moon?lat=59.933333&lon=10.716667&date=${currentDate}&offset=+02:00`,
    { method: 'GET', headers: meteorologyHeaders }
  )
    .then(response => response.text())
    .then(xmlString => {
      dataAsJson = JSON.parse(xmlString)
    })
    .then(() => {
      // https://docs.api.met.no/doc/formats/SunriseJSON.html
      console.log(dataAsJson.properties) // properties
      console.log("~~~~ Moon ~~~~")
      console.log(dataAsJson.properties.moonrise.time)
      console.log("~~~~ Moon ~~~~")
      console.log(dataAsJson.properties.moonset.time)
      console.log("~~~~ Moon ~~~~")
      console.log(dataAsJson.properties.high_moon.time)
      console.log("~~~~ Moon ~~~~")
      console.log(dataAsJson.properties.low_moon.time)
      console.log("~~~~ Moon ~~~~")
      console.log(dataAsJson.properties.moonphase)
      console.log("~~~~ Moon ~~~~")
    })
    .then(() => {
      DATA.moonphase_value = dataAsJson.properties.moonphase
      console.log("Moonphase Value: " + DATA.moonphase_value)

      // echo "⇓⇓⇓⇓⇓⇓⇓⇓ Moon Phase ⇓⇓⇓⇓⇓⇓⇓⇓
      // 🌑 :new_moon:                   360/0
      // 🌒 :waxing_crescent_moon:       0<n<90
      // 🌓 :first_quarter_moon:         90
      // 🌔 :moon: :waxing_gibbous_moon: 90<n<180
      // 🌕 :full_moon:                  180
      // 🌖 :waning_gibbous_moon:        180<n<270
      // 🌗 :last_quarter_moon:          270
      // 🌘 :waning_crescent_moon:"      270<n<360

      // moonphase (time, value), value representing:
      // 0:         New moon
      // 0..90:     Waxing crescent
      // 90..180:   Waxing gibbous
      // 180:       Full moon
      // 180..270:  Waning gibbous
      // 270..360:  Waning crescent

      function between(value, first, last) {
        let lower = Math.min(first, last), upper = Math.max(first, last);
        return value > lower && value < upper;
      }

      if (Math.round(DATA.moonphase_value) == 0
        || Math.round(DATA.moonphase_value) == 360) {
        DATA.moonphase_emoji = ':new_moon:';
        DATA.moonphase_name = 'New';
        console.log('🌑 :new_moon:');
      } else if (between(DATA.moonphase_value, 0, 90)) {
        DATA.moonphase_emoji = ':waxing_crescent_moon:';
        DATA.moonphase_name = 'Waxing Crescent';
        console.log('🌒 :waxing_crescent_moon:');
      } else if (Math.round(DATA.moonphase_value) == 90) {
        DATA.moonphase_emoji = ':first_quarter_moon:';
        DATA.moonphase_name = 'First Quarter';
        console.log('🌓 :first_quarter_moon:');
      } else if (between(DATA.moonphase_value, 90, 180)) {
        DATA.moonphase_emoji = ':waxing_gibbous_moon:';
        DATA.moonphase_name = 'Waxing Gibbous';
        console.log('🌔 :waxing_gibbous_moon:');
      } else if (Math.round(DATA.moonphase_value) == 180) {
        DATA.moonphase_emoji = ':full_moon:';
        DATA.moonphase_name = 'Full';
        console.log('🌕 :full_moon:');
      } else if (between(DATA.moonphase_value, 180, 270)) {
        DATA.moonphase_emoji = ':waning_gibbous_moon:';
        DATA.moonphase_name = 'Waning Gibbous';
        console.log('🌖 :waning_gibbous_moon:');
      } else if (Math.round(DATA.moonphase_value) == 270) {
        DATA.moonphase_emoji = ':last_quarter_moon:';
        DATA.moonphase_name = 'Last Quarter';
        console.log('🌗:last_quarter_moon:');
      } else if (between(DATA.moonphase_value, 270, 360)) {
        DATA.moonphase_emoji = ':waning_crescent_moon:';
        DATA.moonphase_name = 'Waning Crescent';
        console.log('🌘 :waning_crescent_moon:');
      } else {
        console.error('⚠️ Unknown Moonphase ⚠️ : ' + DATA.moonphase_value);
      }
    });
}

async function fetchOpenWeatherData() {
  let openWeatherHeaders = new Headers({
    'Content-Type': 'application/json',
  });

  await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=Oslo,NO&units=metric&appid=${process.env.OPEN_WEATHER_KEY}`,
    { method: 'GET', headers: openWeatherHeaders }
  )
    .then(r => r.json())
    .then(r => {
      console.table(r);
      DATA.city_temperature = Math.round(r.main.temp);
      DATA.city_minimum_temperature = Math.round(r.main.temp_min);
      DATA.city_maximum_temperature = Math.round(r.main.temp_max);
      DATA.city_feels_like = Math.round(r.main.feels_like);
      DATA.city_humidity = Math.round(r.main.humidity);
      DATA.city_pressure = Math.round(r.main.pressure);
      DATA.city_weather = r.weather[0].description;
      DATA.city_weather_icon = r.weather[0].icon;
      DATA.meteorology_data_timestamp = new Date(r.dt * 1000).toLocaleString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Europe/Oslo',
        timeZoneName: 'short',
      });
      DATA.sun_rise = new Date(r.sys.sunrise * 1000).toLocaleString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Oslo',
      });
      DATA.sun_set = new Date(r.sys.sunset * 1000).toLocaleString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Oslo',
      });
    });
}

async function generateReadMe() {
  await fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync('README.md', output);
    console.log(output)
  });
}

module.exports = async ({ github, context, core }) => {
  await fetchMeteorologySunData();
  await fetchMeteorologyMoonData();
  await fetchOpenWeatherData();
  await generateReadMe();
}
