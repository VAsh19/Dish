const express = require("express");
const app = express();

const router = require("./router");
const cors = require("cors");
require("dotenv").config();

const { initializeDataStore } = require("./utils/dataStore");

const APP_PORT = process.env.APP_PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

router(app);

initializeDataStore("./asset/indian_food.csv")
  .then(() => {
    console.log("Data initialized!");
    app.listen(APP_PORT, () => {
      console.log(`chal raha hai kya ${APP_PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error initializing data:", err);
  });
