const winston = require("winston");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const app = express();
const http = require("http");
require("dotenv").config();

const server = http.createServer(app);
const port = process.env.port || 8080;

app.use(morgan("combined"));

app.use(cors());

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get("/access-token", async (req, res) => {
  try {
    const url = process.env.AUTH_TOKEN_URL;
    const { data } = await axios.post(url, {
      client_id: process.env.AUTH_TOKEN_CLIENT_ID,
      client_secret: process.env.AUTH_TOKEN_CLIENT_SECRET,
      audience: process.env.AUTH_TOKEN_AUDIENCE,
      grant_type: process.env.AUTH_TOKEN_GRANT_TYPE
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/", (req, res) => {
  res.status(200).send(`Hello World! Our server is running at port ${port}`);
});

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
