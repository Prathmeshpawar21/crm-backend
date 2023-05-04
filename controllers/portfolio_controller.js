const asyncHandler = require("express-async-handler");
const MongoConnection = require("../config/db");

var client = MongoConnection.connection;

const addView = asyncHandler(async (req, res) => {
  let identifier = req.body.identifier;
  await client.db("portfolio").collection("visits").insertOne({
    identifier: identifier,
  });
  let response = await client
    .db("portfolio")
    .collection("visits")
    .distinct("identifier");

  let count = response.length;

  res.json({
    status: true,
    title: "Success",
    message: "View added successfully",
    data: count,
  });
});

const addDownload = asyncHandler(async (req, res) => {
  let identifier = req.body.identifier;
  await client.db("portfolio").collection("downloads").insertOne({
    identifier: identifier,
  });
  let response = await client
    .db("portfolio")
    .collection("downloads")
    .distinct("identifier");

  let count = response.length;
  res.json({
    status: true,
    title: "Success",
    message: "Download added successfully",
    data: count,
  });
});

const getDownloads = asyncHandler(async (req, res) => {
  let response = await client
    .db("portfolio")
    .collection("downloads")
    .distinct("identifier");

  let count = response.length;
  res.json({
    status: true,
    title: "Success",
    message: "Fetched downloads count successfully",
    data: count,
  });
});

const addResponse = asyncHandler(async (req, res) => {
  let { name, email, project, message } = req.body;
  try {
    if (
      name.trim().length <= 0 ||
      project.trim().length <= 0 ||
      message.trim().length <= 0
    )
      throw "Error, all field are required";
    if (
      email.match(
        "^[a-zA-Z0-9]+(?:.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:.[a-zA-Z0-9]+)*$"
      ).length <= 0
    )
      throw "Invalid email";
    await client.db("portfolio").collection("responses").insertOne({
      name,
      email,
      project,
      message,
    });
    res.json({
      status: true,
      title: "Success",
      message: "Response submitted successfully",
    });
  } catch (error) {
    res.json({
      status: false,
      title: "Failed",
      message: error,
      data: count,
    });
  }
});

module.exports = {
  addView,
  addDownload,
  getDownloads,
  addResponse,
};
