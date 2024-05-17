require("dotenv").config()
const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./routes');
const connectMongoDB = require("./config/mongodb");
const ServerlessHttp = require("serverless-http");


connectMongoDB()

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

// app.get("/.netlify/functions/app", (req, res, next) => {
//   res.json({
//     message: "america ya :D"
//   })
// })

app.use("/.netlify/functions/app",router)

const handler = ServerlessHttp(app)

module.exports.handler = async (event, context) => {
  const result = await handler(event, context);
  return result
}

// module.exports = app
