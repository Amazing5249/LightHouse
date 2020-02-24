/****************************************
 * 
 *   Weather: Plugin for AstralMod that contains weather functions
 *   Copyright (C) 2019 Victor Tran, John Tur, zBlake and lempamo
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * 
 * *************************************/

const Discord = require('discord.js');
const moment = require('moment');
const YQL = require('yql');
const Canvas = require('canvas');
const fs = require('fs');
const timeModule = require("./time.js");
var client;
var consts;

let sunnyImage, moonyImage, cloudyImage, thunderImage, rainImage, windImage, fogImage, humidImage, pressureImage, sunriseImage, sunsetImage, compassImage, snowImage, rainsnowImage, questionImage, unavailImage;

let transArr = {
    0: "WEATHERSTRING_TORNADO",
    1: "WEATHERSTRING_TROPICALSTORM",
    2: "WEATHERSTRING_HURRICANE",
    3: "WEATHERSTRING_SEVERETHUNDERSTORMS",
    4: "WEATHERSTRING_THUNDERSTORMS",
    5: "WEATHERSTRINGS_RAINANDSNOW",
    6: "WEATHERSTRINGS_RAINANDSLEET",
    7: "WEATHERSTRINGS_SNOWANDSLEET",
    8: "WEATHERSTRINGS_FREEZINGDRIZZLE",
    9: "WEATHERSTRINGS_DRIZZLE",
    10: "WEATHERSTRINGS_FREEZINGRAIN",
    11: "WEATHERSTRINGS_SHOWERS",
    12: "WEATHERSTRINGS_SHOWERS",
    13: "WEATHERSTRINGS_SNOWFLURRIES",
    14: "WEATHERSTRINGS_LIGHTSNOWSHOWERS",
    15: "WEATHERSTRINGS_BLOWINGSNOW",
    16: "WEATHERSTRINGS_SNOW",
    17: "WEATHERSTRINGS_HAIL",
    18: "WEATHERSTRINGS_SLEET",
    19: "WEATHERSTRINGS_DUST",
    20: "WEATHERSTRINGS_FOG",
    21: "WEATHERSTRINGS_HAZE",
    22: "WEATHERSTRINGS_SMOCK",
    23: "WEATHERSTRINGS_BLUSTER",
    24: "WEATHERSTRINGS_WIND",
    25: "WEATHERSTRINGS_COLD",
    26: "WEATHERSTRINGS_CLOUDY",
    27: "WEATHERSTRINGS_MOSTLYCLOUDY",
    28: "WEATHERSTRINGS_MOSTLYCLOUDY",
    29: "WEATHERSTRINGS_PARTLYCLOUDY",
    30: "WEATHERSTRINGS_PARTLYCLOUDY",
    31: "WEATHERSTRING_CLEAR",
    32: "WEATHERSTRING_SUNNY",
    33: "WEATHERSTRING_FAIR",
    34: "WEATHERSTRING_FAIR",
    35: "WEATHERSTRING_RAINANDHAIL",
    36: "WEATHERSTRING_HOT",
    37: "WEATHERSTRING_ISOLATEDTHUNDERSTORMS",
    38: "WEATHERSTRING_SCATTEREDTHUNDERSTORMS",
    39: "WEATHERSTRING_SCATTEREDTHUNDERSTORMS",
    40: "WEATHERSTRING_SCATTEREDSHOWERS",
    41: "WEATHERSTRING_HEAVYSNOW",
    42: "WEATHERSTRING_SCATTEREDSNOWSHOWERS",
    43: "WEATHERSTRING_HEAVYSNOW",
    44: "WEATHERSTRINGS_PARTLYCLOUDY",
    45: "WEATHERSTRING_THUNDERSHOWERS",
    46: "WEATHERSTRING_SNOWSHOWERS",
    47: "WEATHERSTRING_ISOLATEDTHUNDERSHOWERS",
    3200: "WEATHERSTRING_NOTAVAILABLE"
}



function getDataFromCode(code, ctx, timeOfDay = "transition", $) {
    log("code: " + code.toString(), logType.debug);
    let retval = {}

    retval.weatherString = $(transArr[code]);
    
    switch (code) {
        case 31:
        case 32:
        case 33:
        case 34:
            //Clear
            //retval.gradient.addColorStop(0, "rgba(0, 200, 255, 0.5)");
            //retval.gradient.addColorStop(1, "rgba(255, 255, 255, 255, 0)");
            if (timeOfDay == "day") {
                retval.gradient = "rgb(120, 200, 255)";
                retval.arr = [120, 200, 255];
                retval.secondary = "rgb(50, 180, 255)";
                retval.text = "black";
                retval.image = sunnyImage;
            } else if (timeOfDay == "night") {
                retval.weatherString = $("WEATHERSTRING_CLEAR")
                retval.gradient = "rgb(0, 50, 100)";
                retval.arr = [0, 50, 100];
                retval.secondary = "rgb(0, 25, 50)";
                retval.text = "white";
                retval.image = moonyImage;
            } else { //transition
                retval.gradient = "rgb(234, 128, 25)";
                retval.arr = [234, 128, 25];
                retval.secondary = "rgb(170, 90, 20)";
                retval.text = "black";
                retval.image = sunnyImage;
            }
            break;
        case 1: 
        case 2:
        case 7:
        case 17:
        case 18:
        case 22:
        case 25:
        case 26:
        case 27:
        case 28:
        case 29:
        case 30:
        case 35:
        case 44:
            //Cloudy
            //retval.gradient.addColorStop(0, "rgba(100, 100, 100, 0.5)");
            //retval.gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
            retval.gradient = "rgb(200, 200, 200)";
            retval.arr = [200, 200, 200];
            retval.secondary = "rgb(170, 170, 170)";
            retval.text = "black";
            retval.image = cloudyImage;
            break;
        case 6:
        case 8:
        case 9:
        case 10:
        case 11:
        case 12:
            //Rainy
            //retval.gradient.addColorStop(0, "rgba(100, 100, 100, 0.5)");
            //retval.gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
            retval.gradient = "rgb(200, 200, 200)";
            retval.arr = [200, 200, 200];
            retval.secondary = "rgb(170, 170, 170)";
            retval.text = "black";
            retval.image = rainImage;
            break;
        case 0:
        case 23:
        case 24:
            //Windy
            //retval.gradient.addColorStop(0, "rgba(100, 100, 100, 0.5)");
            //retval.gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
            retval.gradient = "rgb(200, 200, 200)";
            retval.arr = [200, 200, 200];
            retval.secondary = "rgb(170, 170, 170)";
            retval.text = "black";
            retval.image = windImage;
            break;
        case 19:
        case 20:
        case 21:
        case 22:
            //Fog
            //retval.gradient.addColorStop(0, "rgba(100, 100, 100, 0.5)");
            //retval.gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
            retval.gradient = "rgb(200, 200, 200)";
            retval.arr = [200, 200, 200];
            retval.secondary = "rgb(170, 170, 170)";
            retval.text = "black";
            retval.image = windImage;
            break;
        case 36:
            //Hot
            //retval.gradient.addColorStop(0, "rgba(255, 100, 0, 0.5)");
            //retval.gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
            retval.gradient = "rgb(255, 100, 0)";
            retval.arr = [255, 100, 0];
            retval.secondary = "rgb(200, 100, 0)";
            retval.text = "black";
            retval.image = sunnyImage;
            break;
        case 3:
        case 4:
        case 37:
        case 38:
        case 39:
        case 40:
        case 45:
        case 47:
            //Thunder
            //retval.gradient.addColorStop(0, "rgba(100, 100, 100, 0.5)");
            //retval.gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
            retval.gradient = "rgb(200, 200, 200)";
            retval.arr = [200, 200, 200];
            retval.secondary = "rgb(170, 170, 170)";
            retval.text = "black";
            retval.image = thunderImage;
            break;
        case 13:
        case 14:
        case 15:
        case 16:
        case 41:
        case 43:
            //Snow
            retval.gradient = "rgb(200, 200, 200)";
            retval.arr = [200, 200, 200];
            retval.secondary = "rgb(170, 170, 170)";
            retval.text = "black";
            retval.image = snowImage;
            break;
        case 5:
        case 42:
        case 46:
            //Rain + Snow
            retval.gradient = "rgb(200, 200, 200)";
            retval.arr = [200, 200, 200];
            retval.secondary = "rgb(170, 170, 170)";
            retval.text = "black";
            retval.image = rainsnowImage;
            break;
    }
    return retval;
}

function sendCurrentWeather(message, location, type, options, user = "", skiiness = false) {
    let $ = _[options.locale];
    sendPreloader($("WEATHER_PREPARING"), message.channel).then(messageToEdit => {
        /*let query;
        let unit = options.imperial ? "f" : "c";

        if (type == "location") {
            query = new YQL("select * from weather.forecast where woeid in (select woeid from geo.places(1) where text=\"" + location + "\") and u=\"" + unit + "\"");
        } else if (type == "id") {
            query = new YQL("select * from weather.forecast where woeid=" + location + " and u=\"" + unit + "\"");
        }

        query.exec(function(err, data) {
            try {
                if (err) {
                    throw new CommandError(err);
                } else {*/
                    //First case is for a requested city that does not exist. Second case is for when YQL doesn't
                    //have any data for the requested city.
                    /*if (data.query.results === null || Object.keys(data.query.results.channel).length === 1) {
                        let embed = new Discord.RichEmbed;
                        embed.setTitle($("WEATHER_ERROR", {emoji: ":thunder_cloud_rain:"}));
                        embed.setDescription($("WEATHER_ERROR_NOT_RETRIEVED"));
                        embed.setColor(consts.colors.fail);
                        embed.addField($("WEATHER_ERROR_DETAILS"), $("WEATHER_ERROR_CITY_NOT_FOUND"));
                        embed.addField($("WEATHER_ERROR_TRY_THIS"), $("WEATHER_ERROR_TRY_THIS_DESCRIPTION", {prefix: prefix(message.guild.id)}));

                        messageToEdit.edit(embed);
                        return;
                    }*/

                    //Time info
                    //let pd = data.query.results.channel.item.pubDate;
                    //let date = moment(new Date(pd.substring(0, pd.lastIndexOf(" "))));
                    //let tz = pd.substring(pd.lastIndexOf(" "));
                    //let currentDate = moment.utc().add(timeModule.utcOffsetFromTimezone(tz.toLowerCase().trim()) * 3600000, "ms");

                    //Determine the time of day
                    let timeOfDay = "day";
                    //let sunriseDate = moment.utc("1970-01-01 " + data.query.results.channel.astronomy.sunrise, "YYYY-MM-DD HH:mm A");
                    //sunriseDate.dayOfYear(date.dayOfYear());
                    //sunriseDate.year(date.year());
                    //let sunsetDate = moment.utc("1970-01-01 " + data.query.results.channel.astronomy.sunset, "YYYY-MM-DD HH:mm A");
                    //sunsetDate.dayOfYear(date.dayOfYear());
                    //sunsetDate.year(date.year());

                    //if (currentDate.isBetween(sunriseDate.clone().add(30, "m"), sunsetDate.clone().subtract(30, "m"))) {
                        //timeOfDay = "day";
                    //} else if (currentDate.isBefore(sunriseDate.clone().subtract(30, "m")) || currentDate.isAfter(sunsetDate.clone().add(30, "m"))) {
                        //timeOfDay = "night";
                    //} else {
                        //timeOfDay = "transition";
                    //}

                    var canvas = new Canvas(500, 410);
                    var ctx = canvas.getContext('2d');

                    //let display = getDataFromCode(parseInt(data.query.results.channel.item.condition.code), ctx, timeOfDay, $);
                    let display = {
                        gradient: "rgb(120, 200, 255)",
                        arr: [120, 200, 255],
                        secondary:"rgb(50, 180, 255)",
                        text: "black",
                        image: questionImage,
                        weatherString: "---"
                    }

                    let tempUnit = "°C"; // + data.query.results.channel.units.temperature;
                    let speedUnit = "km/h"; //data.query.results.channel.units.speed;
                    let pressureUnit = "mb"; //data.query.results.channel.units.pressure;

                    ctx.fillStyle = display.gradient;
                    ctx.fillRect(0, 0, 350, 410);

                    ctx.fillStyle = display.secondary;
                    ctx.fillRect(350, 0, 150, 410);

                    ctx.font = "20px Contemporary";
                    ctx.fillStyle = display.text;

                    let currentWeatherText = $("WEATHER_CURRENT_WEATHER");
                    if (user != "") {
                        currentWeatherText += " - " + user;
                    }

                    let currentWeatherWidth = ctx.measureText(currentWeatherText);
                    if (currentWeatherWidth.width > 325) {
                        let textCanvas = new Canvas(currentWeatherWidth.width, 30);
                        let txtCtx = textCanvas.getContext('2d');
                        txtCtx.font = "20px Contemporary";
                        txtCtx.fillStyle = display.text;
                        txtCtx.fillText(currentWeatherText, 0, 20);

                        ctx.drawImage(textCanvas, 10, 10, 325, 30);
                    } else {
                        ctx.fillText(currentWeatherText, (350 / 2) - (currentWeatherWidth.width / 2), 30);
                    }

                    //Draw 'as of' info
                    ctx.font = "14px Contemporary";

                    //let pubDate = "As of " + date.format("dddd, MMMM D") + " at " + date.format(timeString) + tz;

                    //let pubDate = $("WEATHER_DATE_UPDATED", {updated:{date:date.utcOffset(timeModule.utcOffsetFromTimezone(tz.trim().toLowerCase()), true), h24:options.h24}});
                    let pubDate = $("WEATHER_DATE_UPDATED", {updated:{date:moment(), h24:options.h24}});
                    let dateWidth = ctx.measureText(pubDate);
                    if (dateWidth.width > 325) {
                        let textCanvas = new Canvas(dateWidth.width, 50);
                        let txtCtx = textCanvas.getContext('2d');
                        txtCtx.font = "14px Contemporary";
                        txtCtx.fillStyle = display.text;
                        txtCtx.fillText(pubDate, 0, 20);

                        ctx.drawImage(textCanvas, 10, 30, 325, 50);
                    } else {
                        //ctx.fillText(currentWeatherText, (350 / 2) - (currentWeatherWidth.width / 2), 30);
                        ctx.fillText(pubDate, (350 / 2) - (dateWidth.width / 2), 50);
                    }


                    //Image goes between 100-200px y
                   ctx.drawImage(display.image, 100, 60);

                   ctx.font = "bold 20px Contemporary";
                   ctx.fillStyle = display.text;
                   let funText = skiiness ? "Even if the weather is down, the admirable ski jacket is not! ∞ ski jacket!" : "---";
                   let funWidth = ctx.measureText(funText);
                   if (funWidth.width > 325) {
                       let textCanvas = new Canvas(funWidth.width, 50);
                       let txtCtx = textCanvas.getContext('2d');
                       txtCtx.font = "bold 20px Contemporary";
                       txtCtx.fillStyle = display.text;
                       txtCtx.fillText(funText, 0, 40);

                       ctx.drawImage(textCanvas, 13, 180, 325, 50);
                   } else {
                        ctx.fillText(funText, 175 - funWidth.width / 2, 228);
                   }



                    ctx.font = "12px Contemporary";
                    ctx.fillStyle = display.text;
                    let countryWidth = ctx.measureText("---" + " - " + "---");
                    ctx.fillText("---" + " - " + "---", 175 - countryWidth.width / 2, 245);

                    ctx.font = "40px Contemporary";
                    let conditionWidth = ctx.measureText(display.weatherString);
                    if (conditionWidth.width > 325) {
                        let textCanvas = new Canvas(conditionWidth.width, 50);
                        let txtCtx = textCanvas.getContext('2d');
                        txtCtx.font = "light 40px Contemporary";
                        txtCtx.fillStyle = display.text;
                        txtCtx.fillText(display.weatherString, 0, 40);

                        ctx.drawImage(textCanvas, 13, 240, 325, 50);
                    } else {
                        ctx.fillText(display.weatherString, 175 - conditionWidth.width / 2, 280);
                    }

                    ctx.font = "30px Contemporary";
                    let currentTemp = "---" + tempUnit;
                    let tempWidth = ctx.measureText(currentTemp);
                    ctx.fillText(currentTemp, 175 - tempWidth.width / 2, 315);


                    //Draw wind info
                    ctx.drawImage(windImage, 50, 330, 20, 20);
                    ctx.font = "14px Contemporary";
                    let currentWind = "---" + " " + speedUnit;
                    ctx.fillText(currentWind, 77, 345);

                    //Draw humidity info
                    ctx.drawImage(humidImage, 50, 355, 20, 20);
                    let currentHumid = "---" + "%";
                    ctx.fillText(currentHumid, 77, 370);

                    //Draw pressure info
                    //Yahoo's pressure API returns bad results - we have to manually fix them.
                    ctx.drawImage(pressureImage, 50, 380, 20, 20);
                    //let pressureResult = "---";
                    //let sigPlaces = 3;

                    // Millibars were requested - convert milli-feet of head to millibars
                    /*if (pressureUnit === "in") {
                        pressureUnit = "inHg";
                        let feetOfHead = parseFloat(pressureResult) / 1000; //For whatever reason they don't actually give it in real feet of head
                        pressureResult = feetOfHead * 29.890669; //Conversion to milliBars
                    }

                    // Inches of mercury was requested - convert millibars to inches of mercury
                    else {
                        pressureResult = parseFloat(pressureResult) / 33.864;
                        sigPlaces = 0;
                    }*/

                    let currentPressure = "---" + " " + pressureUnit; //pressureResult.toFixed(sigPlaces) + " " + pressureUnit;
                    ctx.fillText(currentPressure, 77, 395);

                    //Draw wind speed
                    ctx.drawImage(compassImage, 200, 330, 20, 20);
                    /*let compass = parseInt(data.query.results.channel.wind.direction);
                    let cardinal;
                    if (compass < 22) {
                        cardinal = "N";
                    } else if (compass < 67) {
                        cardinal = "NE";
                    } else if (compass < 112) {
                        cardinal = "E";
                    } else if (compass < 157) {
                        cardinal = "SE";
                    } else if (compass < 202) {
                        cardinal = "S";
                    } else if (compass < 247) {
                        cardinal = "SW";
                    } else if (compass < 292) {
                        cardinal = "W";
                    } else if (compass < 337) {
                        cardinal = "NW";
                    } else {
                        cardinal = "N";
                    }
                    ctx.fillText(compass + "° (" + cardinal + ")", 227, 345);*/
                    ctx.fillText("---" + "° (" + "---" + ")", 227, 345);

                    //Draw sunrise info
                    ctx.drawImage(sunriseImage, 200, 355, 20, 20);
                    ctx.drawImage(sunsetImage, 200, 380, 20, 20);
                    /*let sunriseTime = moment(data.query.results.channel.astronomy.sunrise, "h:m a");
                    ctx.fillText($("SPECIAL_STIME", {time: {date: sunriseTime, h24:options.h24}}), 227, 370);

                    //Draw sunset info
                    ctx.drawImage(sunsetImage, 200, 380, 20, 20);
                    let sunsetTime = moment(data.query.results.channel.astronomy.sunset, "h:m a");
                    ctx.fillText($("SPECIAL_STIME", {time: {date: sunsetTime, h24:options.h24}}), 227, 395);*/

                    ctx.fillText("---", 227, 370);
                    ctx.fillText("---", 227, 395);

                    ctx.beginPath();
                    ctx.strokeStyle = display.text;
                    ctx.moveTo(350, 0);
                    ctx.lineTo(350, 410);
                    ctx.stroke();

                    //350 - 500x for upcoming weather data
                    //82px per data pane

                    let current = 0;
                    
                    let ml;
                    if (options.locale.startsWith("zh")) {
                        ml = moment.localeData("zh-cn");
                    } else {
                        ml = moment.localeData(options.locale);
                    }
                    for (key in [1,2,3,4,5]) {
                        current++;
                        if (current > 5) {
                            break;
                        }
                        //let day = data.query.results.channel.item.forecast[key];

                        //let display = getDataFromCode(parseInt(day.code), ctx, null, _[options.locale]);

                        ctx.font = "20px Contemporary";

                        let dayText = "---";
                        if (current == 1) {
                            dayText = $("WEATHER_TODAY").toUpperCase();
                        } else {
                            //dayText = ml.weekdaysShort()[["sun", "mon", "tue", "wed", "thu", "fri", "sat"].indexOf(day.day.toLowerCase())].toUpperCase().trim();
                        }
                        let dayWidth = ctx.measureText(dayText);
                        
                        if (dayWidth.width > 72) {
                            let textCanvas = new Canvas(dayWidth.width, dayWidth.emHeightAscent + dayWidth.emHeightDescent);
                            let txtCtx = textCanvas.getContext('2d');
                            txtCtx.font = "20px Contemporary";
                            txtCtx.fillStyle = ctx.fillStyle;
                            txtCtx.fillText(dayText, 0, 20);

                            ctx.rotate(-Math.PI / 2);
                            ctx.drawImage(textCanvas, -current * 82 + 5, 372 - dayWidth.emHeightAscent, 72, dayWidth.emHeightAscent + dayWidth.emHeightDescent);
                            ctx.rotate(Math.PI / 2);
                        } else {
                            let y = (current - 1) * 82 + 41 + (dayWidth.width / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.fillText(dayText, -y, 372);
                            ctx.rotate(Math.PI / 2);
                        }

                        //Draw image
                        ctx.drawImage(questionImage, 380, (current - 1) * 82 + 9, 64, 64);

                        //Draw temperatures
                        ctx.fillText("---" + "°", 450, (current - 1) * 82 + 30);
                        ctx.fillText("---" + "°", 450, (current - 1) * 82 + 60);

                        ctx.beginPath();
                        ctx.moveTo(350, current * 82);
                        ctx.lineTo(500, current * 82);
                        ctx.stroke();
                    }
                    
                    //Now overlay the weather with an error
                    ctx.fillStyle = "rgba(255, 0, 0, 0.65)";
                    ctx.fillRect(0, 0, 500, 410);

                    ctx.drawImage(unavailImage, 175, 60, 150, 150);

                    ctx.fillStyle = "rgb(255, 255, 255)";
                    ctx.font = "30px Contemporary";
                    let unavailableText = ctx.measureText("Weather Unavailable");
                    ctx.fillText("Weather Unavailable", (500 / 2) - (unavailableText.width / 2), 250);

                    ctx.font = "20px Contemporary";
                    ctx.textAlign = "center";
                    ctx.fillText("The weather command is unavailable in", (500 / 2), 300);
                    ctx.fillText("AstralMod 3.0. It will be coming back", (500 / 2), 320);
                    ctx.fillText("in AstralMod 3.1.", (500 / 2), 340);

                    ctx.font = "15px Contemporary";
                    ctx.fillText("We sincerely apologise for the inconvenience.", (500 / 2), 370);

                    /*ctx.strokeStyle = "rgb(255, 255, 255)";
                    ctx.beginPath();
                    ctx.moveTo(0, 40);
                    ctx.lineTo(500, 40);
                    ctx.moveTo(0, 380);
                    ctx.lineTo(500, 380);
                    ctx.stroke();*/

                    let e = new Discord.RichEmbed();
                    e.setColor(consts.colors.none)
                    e.attachFile(new Discord.Attachment(canvas.toBuffer(), "weather.png"))
                    e.setImage("attachment://weather.png");
                    //e.setThumbnail("https://poweredby.yahoo.com/white_retina.png");
                    e.setTitle($("WEATHER_TITLE"));
                    //e.setURL(data.query.results.channel.link);
                    // e.setColor(display.arr);
                    e.setFooter(getRandom($("WEATHER_PLEASE_PRINT"),
                                        $("WEATHER_TEAR_PERFORATED_LINE"),
                                        $("WEATHER_SO_MANY_DEGREES"),
                                        $("WEATHER_LONGER_DAYS")));
                    message.channel.send(e).then(function() {
                        messageToEdit.delete();
                    });
                /*}
            } catch (err) {
                if (process.argv.indexOf("--debug") !== -1) {
                    message.channel.send(err.stack);
                }

                messageToEdit.edit(err.toString() + "\nTry resetting your location with `" + prefix(message.guild.id) + "setloc`");
            }
        });*/
    });
}

function processCommand(message, isMod, command, options) {
    let unit = options.imperial ? "f" : "c";
    let time = options.h24 ? "24" : "12";
    let $ = _[options.locale];

    let skiiness = (command.indexOf("--skiiness") != -1)
    command = command.replace("--skiiness", "");
    command = command.trim();


    if (command.startsWith("weather ")) {
        var location = command.substr(8);

        /*if (command.indexOf("--user") == -1) {
            sendCurrentWeather(message, location, "location", options, "", skiiness);
        } else {
            location = location.replace("--user", "").trim();
            var users = parseUser(location, message.guild);
    
            if (users.length > 0) {
                if (settings.users.hasOwnProperty(users[0].id)) {
                    var userObject = settings.users[users[0].id];
                    if (userObject != null) {
                        if (userObject.hasOwnProperty("location")) {
                            sendCurrentWeather(message, userObject.location, "id", options, users[0].tag, skiiness);
                            return;
                        }
                    }
                }
                throw new UserInputError($("WEATHER_ERROR_UNSET_LOCATION", {user: users[0].username, prefix: prefix(message.guild.id)}));
            } else {
                throw new CommandError($("WEATHER_USER_NOT_FOUND"));
            }
        }*/
        sendCurrentWeather(message, "", "", options, "", skiiness);
    } else if (command == "weather") {
        sendCurrentWeather(message, "", "", options, "", skiiness);
        /*
        if (settings.users[message.author.id] == null) {
            settings.users[message.author.id] = {};
        }

        if (settings.users[message.author.id].location == null) {
            throw new UserInputError($("WEATHER_ERROR_UNSET_LOCATION", {user: message.author.username, prefix: prefix(message.guild.id)}));
        } else {
            sendCurrentWeather(message, settings.users[message.author.id].location, "id", options, message.author.tag, skiiness);
        }*/
    } else if (command.startsWith("setloc ")) {
        /*
        if (location == "") {
            message.reply($("SETLOC_ABOUT"));
        } else {
            var query = new YQL("select * from geo.places where text=\""+ location +"\"");
            
            query.exec(function(err, data) {
                try {
                    if (err) {
                        throw new UserInputError($("SETLOC_CITY_NOT_FOUND"));
                    } else {
                        if (data == null) throw new UserInputError($("SETLOC_CITY_NOT_FOUND"));
                        if (data.query == null) throw new UserInputError($("SETLOC_CITY_NOT_FOUND"));
                        if (data.query.results == null) throw new UserInputError($("SETLOC_CITY_NOT_FOUND"));
                        if (data.query.results.place == null) throw new UserInputError($("SETLOC_CITY_NOT_FOUND"));
    
                        var userSettings = settings.users[message.author.id];
                    
                        if (userSettings == null) {
                            userSettings = {};
                        }
                        var place;
                        if (data.query.results == null) throw new UserInputError($("SETLOC_CITY_NOT_FOUND"));
                        if (data.query.results.place[0] != null) place = data.query.results.place[0];
                        else place = data.query.results.place;
                            
                        userSettings.location = place.woeid;
                
                        settings.users[message.author.id] = userSettings;
                            
                        log(place);
                            
                        //Translation through the ages
                        
                        //message.reply(tr("Your location is now $[1], $[2] ($[3], $[4]).", place.name, place.country.code, place.centroid.latitude, place.centroid.longitude));
                        //message.reply("Your location is now " + place.name + ", " + place.country.code + " (" + place.centroid.latitude + ", " + place.centroid.longitude + ")");
                        message.reply($("SETLOC_CITY_SET", {place: place.name, countryCode: place.country.code, lat: place.centroid.latitude, long: place.centroid.longitude}))
                    } 
                } catch (err) {
                    let embed = new Discord.RichEmbed;
                    embed.setColor(consts.colors.fail);
                    embed.addField($("ERROR_DETAILS"), err.message);
                    embed.setTitle(getEmoji("userexception") + " " + $("ERROR_USER_INPUT"));
                    embed.setDescription($("ERROR_NOT_UNDERSTAND"));
                    
                    message.channel.send(embed);
                }
            });
        }*/

        let embed = new Discord.RichEmbed;
        embed.setColor(consts.colors.fail);
        embed.setTitle("Weather Unavailable");
        embed.setDescription("The weather command is unavailable in AstralMod 3.0. It will be coming back in AstralMod 3.1.");
        embed.setFooter("We sincerely apologise for the inconvenience.");

        message.channel.send(embed);
    } else if (command == "setloc") {
        let embed = new Discord.RichEmbed;
        embed.setColor(consts.colors.fail);
        embed.setTitle("Weather Unavailable");
        embed.setDescription("The weather command is unavailable in AstralMod 3.0. It will be coming back in AstralMod 3.1.");
        embed.setFooter("We sincerely apologise for the inconvenience.");

        message.channel.send(embed);
    }
}

module.exports = {
    name: "Weather",
    translatableName: "TITLE_WEATHER",
    constructor: function(discordClient, commandEmitter, constants) {
        client = discordClient;
        consts = constants;

        sunnyImage = new Canvas.Image();
        fs.readFile("./plugins/images/sunny.png", function(err, data) {
            sunnyImage.src = data;
        });

        moonyImage = new Canvas.Image();
        fs.readFile("./plugins/images/moony.png", function(err, data) {
            moonyImage.src = data;
        });

        cloudyImage = new Canvas.Image();
        fs.readFile("./plugins/images/cloudy.png", function(err, data) {
            cloudyImage.src = data;
        });


        thunderImage = new Canvas.Image();
        fs.readFile("./plugins/images/thunder.png", function(err, data) {
            thunderImage.src = data;
        });

        rainImage = new Canvas.Image();
        fs.readFile("./plugins/images/rain.png", function(err, data) {
            rainImage.src = data;
        });

        windImage = new Canvas.Image();
        fs.readFile("./plugins/images/wind.png", function(err, data) {
            windImage.src = data;
        });

        fogImage = new Canvas.Image();
        fs.readFile("./plugins/images/fog.png", function(err, data) {
            fogImage.src = data;
        });
        
        pressureImage = new Canvas.Image();
        fs.readFile("./plugins/images/pressure.png", function(err, data) {
            pressureImage.src = data;
        });

        humidImage = new Canvas.Image();
        fs.readFile("./plugins/images/humidity.png", function(err, data) {
            humidImage.src = data;
        });

        sunsetImage = new Canvas.Image();
        fs.readFile("./plugins/images/sunset.png", function(err, data) {
            sunsetImage.src = data;
        });

        sunriseImage = new Canvas.Image();
        fs.readFile("./plugins/images/sunrise.png", function(err, data) {
            sunriseImage.src = data;
        });

        compassImage = new Canvas.Image();
        fs.readFile("./plugins/images/compass.png", function(err, data) {
            compassImage.src = data;
        });

        snowImage = new Canvas.Image();
        fs.readFile("./plugins/images/snow.png", function(err, data) {
            snowImage.src = data;
        });

        rainsnowImage = new Canvas.Image();
        fs.readFile("./plugins/images/rainsnow.png", function(err, data) {
            rainsnowImage.src = data;
        });

        questionImage = new Canvas.Image();
        fs.readFile("./plugins/images/question.png", function(err, data) {
            questionImage.src = data;
        });

        unavailImage = new Canvas.Image();
        fs.readFile("./plugins/images/unavail.png", function(err, data) {
            unavailImage.src = data;
        });

        commandEmitter.on('processCommand', processCommand);
    },
    destructor: function(commandEmitter) {
        commandEmitter.removeListener('processCommand', processCommand);
    },
    availableCommands: {
        general: {
            commands: [
                "weather",
                "setloc"
            ],
            modCommands: [
                
            ]
        }
    },
    acquireHelp: function(helpCmd, message, h$) {
        var help = {};

        switch (helpCmd) {
            case "weather":
                help.title = prefix(message.guild.id) + "weather";
                help.usageText = prefix(message.guild.id) + "weather [options] [location]";
                help.helpText = h$("WEATHER_HELPTEXT");
                help.param1 = h$("WEATHER_PARAM1");
                help.availableOptions = h$("WEATHER_AVAILABLEOPTIONS");
                help.remarks = h$("WEATHER_REMARKS", {prefix: prefix(message.guild.id)});
                break;
            case "setloc":
                help.title = prefix(message.guild.id) + "setloc";
                help.usageText = prefix(message.guild.id) + "setloc [location]";
                help.helpText = h$("SETLOC_HELPTEXT");
                help.param1 = h$("SETLOC_PARAM1");
                help.remarks = h$("SETLOC_REMARKS");
                break;
        }

        return help;
    }
}