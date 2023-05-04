const asyncHandler = require("express-async-handler");
const MongoConnection = require("../config/db");
const { ObjectId } = require("mongodb");

var client = MongoConnection.connection;

const addLeadRecord = asyncHandler(async (req, res) => {
  let username = req.body.username;
  let title = req.body.title;
  let status = req.body.status;
  let description = req.body.description;

  if (!username || !title || !status) {
    res.json({
      status: false,
      msg: "Invalid request",
    });
  } else {
    let user = await client.db("crm").collection("users").findOne({ username });
    if (!user) {
      //User not found
      res.status(404).json({
        status: false,
        msg: "User not found",
        data: null,
      });
    } else {
      let serviceRecord = await client.db("crm").collection("leads").insertOne({
        title,
        status,
        description,
        created_by: user.firstname,
      });
      res.json({
        status: true,
        msg: "Lead record created successfully",
      });
    }
  }
});

const updateLeadRecord = asyncHandler(async (req, res) => {
  let username = req.body.username;
  let _id = req.body._id;
  let title = req.body.title;
  let status = req.body.status;
  let description = req.body.description;

  if (!username || !title || !status || !_id) {
    res.json({
      status: false,
      msg: "Invalid request",
    });
  } else {
    let user = await client.db("crm").collection("users").findOne({ username });
    if (!user) {
      //User not found
      res.status(404).json({
        status: false,
        msg: "User not found",
        data: null,
      });
    } else {
      let serviceRecord = await client
        .db("crm")
        .collection("leads")
        .updateOne(
          { _id: ObjectId(_id) },
          {
            $set: {
              title,
              status,
              description,
              created_by: user.firstname,
            },
          }
        );
      res.json({
        status: true,
        msg: "Lead record updated successfully",
        data: serviceRecord,
      });
    }
  }
});

const deleteLeadRecord = asyncHandler(async (req, res) => {
  let username = req.body.username;
  let _id = req.body._id;

  if (!username || !_id) {
    res.json({
      status: false,
      msg: "Invalid request",
    });
  } else {
    let user = await client.db("crm").collection("users").findOne({ username });
    if (!user) {
      //User not found
      res.status(404).json({
        status: false,
        msg: "User not found",
        data: null,
      });
    } else {
      if (user.type === "Employee") {
        res.status(200).json({
          status: false,
          msg: "You don't have the privileges to delete this record",
          data: null,
        });
      } else {
        let serviceRecord = await client
          .db("crm")
          .collection("leads")
          .findOneAndDelete({ _id: ObjectId(_id) });
        res.json({
          status: true,
          msg: "Lead record deleted successfully",
        });
      }
    }
  }
});

const getLeadRecords = asyncHandler(async (req, res) => {
  let username = req.body.username;

  if (!username) {
    res.json({
      status: false,
      msg: "Invalid request",
    });
  } else {
    let user = await client.db("crm").collection("users").findOne({ username });
    if (!user) {
      //User not found
      res.status(404).json({
        status: false,
        msg: "User not found",
        data: null,
      });
    } else {
      let serviceRecord = await client
        .db("crm")
        .collection("leads")
        .find()
        .toArray();
      res.json({
        status: true,
        msg: "Lead record fetched successfully",
        data: serviceRecord,
      });
    }
  }
});

module.exports = {
  addLeadRecord,
  updateLeadRecord,
  deleteLeadRecord,
  getLeadRecords,
};
