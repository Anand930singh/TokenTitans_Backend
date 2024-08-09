const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// MongoDB connection string
require("dotenv").config();

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const app = express();
app.use(express.json());
app.use(cors());

const dataSchema = new mongoose.Schema({
  IpfsHash: String,
  PinSize: Number,
  Timestamp: Date,
  isDuplicate: Boolean,
});

const Data = mongoose.model("Data", dataSchema);

app.post("/store", async (req, res) => {
  try {
    const { IpfsHash, PinSize, Timestamp } = req.body;
    const newData = new Data({ IpfsHash, PinSize, Timestamp });
    await newData.save();
    res.status(201).send("Data stored successfully");
  } catch (error) {
    res.status(500).send("Error storing data: " + error.message);
  }
});

app.get("/retrieve", async (req, res) => {
  try {
    const data = await Data.find();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send("Error retrieving data: " + error.message);
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
