const winston = require("winston");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const app = express();
const http = require("http");

const swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger.json");

require("dotenv").config();

const server = http.createServer(app);
const port = process.env.port || 8080;

app.use(morgan("dev"));

app.use(cors());

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument)); // Path to view swgger docs

app.get("/app-data", async (req, res) => {
  try {
    // Fetch access token
    const url = process.env.AUTH_TOKEN_URL;
    const { data: tokenData } = await axios.post(url, {
      client_id: process.env.AUTH_TOKEN_CLIENT_ID,
      client_secret: process.env.AUTH_TOKEN_CLIENT_SECRET,
      audience: process.env.AUTH_TOKEN_AUDIENCE,
      grant_type: process.env.AUTH_TOKEN_GRANT_TYPE
    });

    // Fetch cms data
    const cmsUrl =
      process.env.REDIG_BASE_URL +
      `/entries?contentType=customerServicePage&market=${req.query.market}&environment=${req.query.environment}`;
    const { data: cmsData } = await axios.get(cmsUrl, {
      params: {},
      headers: { Authorization: "Bearer " + tokenData.access_token }
    });
    res.status(200).json(cmsData);
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
