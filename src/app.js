require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const cheerio = require("cheerio");

const app = express();

const morganOption = process.env.NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

var indeedPosition;
var indeedCity;
var indeedState;
// need to state code from city for indeed search

// send csv possition and locations
app.get("/", (req, res) => {
  res.send({ Positions: positionsArray, Locations: locationsArray });
  // get positions and locations from .csv
});

// send resume/ jobs score
app.get("/score", (req, res) => {
  indeedCity = req.query.location;
  indeedPosition = req.query.position;

  const numIndeedJobs = fetchHTML(indeedPosition, indeedCity, "TX");
  // return R/J score
  const calculatedScore;
  res.send({ Score: calculatedScore });
});

var csv = require("csvtojson");

// Convert a csv file with csvtojson

// const getCsvData = () => {
csv()
  // get .csv locally
  .fromFile("./resume_data.csv")
  // where column a = position
  // where column b = location
  // return column c
  .then(function (jsonArrayObj) {
    //when parse finished, result will be emitted here.
    console.log(jsonArrayObj);
  });
// };

const axios = require("axios");

async function fetchHTML(position, city, state) {
  const searchURL = `https://www.indeed.com/jobs?q=${position}&l=${city}%2C+%${state}`;
  const { data } = await axios.get(searchURL);
  const $ = cheerio.load(data);
  console.log($('div[id="searchCountPages"'));
}

// Print some specific page content
// console.log(`First h1 tag: ${$("#searchCountPages").text()}`);

// Parse large csv with stream / pipe (low mem consumption)
// csv()
//   .fromStream(readableStream)
//   .subscribe(function (jsonObj) {
//     //single json object will be emitted for each csv line
//     // parse each json asynchronousely
//     return new Promise(function (resolve, reject) {
//       asyncStoreToDb(json, function () {
//         resolve();
//       });
//     });
//   });

//Use async / await
// const jsonArray = await csv().fromFile(filePath);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
