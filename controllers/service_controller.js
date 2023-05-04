const asyncHandler = require("express-async-handler");
const MongoConnection = require("../config/db");
const { ObjectId } = require("mongodb");

var client = MongoConnection.connection;

const addServiceRequest = asyncHandler(async (req, res) => {
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
      await client.db("crm").collection("services").insertOne({
        title,
        status,
        description,
        created_by: user.firstname,
      });
      res.json({
        status: true,
        msg: "Service record created successfully",
      });
    }
  }
});

const updateServiceRequest = asyncHandler(async (req, res) => {
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
        .collection("services")
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
        msg: "Service record updated successfully",
        data: serviceRecord,
      });
    }
  }
});

const deleteServiceRequest = asyncHandler(async (req, res) => {
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
        await client
          .db("crm")
          .collection("services")
          .findOneAndDelete({ _id: ObjectId(_id) });
        res.json({
          status: true,
          msg: "Service record deleted successfully",
        });
      }
    }
  }
});

const getServiceRequests = asyncHandler(async (req, res) => {
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
        .collection("services")
        .find()
        .toArray();
      res.json({
        status: true,
        msg: "Service record fetched successfully",
        data: serviceRecord,
      });
    }
  }
});

module.exports = {
  addServiceRequest,
  updateServiceRequest,
  deleteServiceRequest,
  getServiceRequests,
};
