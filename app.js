require("dotenv").config()
const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./routes');
const connectMongoDB = require("./config/mongodb");



app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(router)

module.exports = app
