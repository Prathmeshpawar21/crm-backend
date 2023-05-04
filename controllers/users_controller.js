const asyncHandler = require("express-async-handler");
const MongoConnection = require("../config/db");
const { ObjectId } = require("mongodb");

var client = MongoConnection.connection;

const updateExisitingUserRole = asyncHandler(async (req, res) => {
  let username = req.body.username;
  let _id = req.body._id;
  let title = req.body.title;

  if (!username || !title || !_id) {
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
      if (user.type !== "Admin") {
        res.status(200).json({
          status: false,
          msg: "You don't have the privileges to edit a user",
          data: null,
        });
      } else {
        let serviceRecord = await client
          .db("crm")
          .collection("users")
          .updateOne(
            { _id: ObjectId(_id) },
            {
              $set: {
                type: title,
              },
            }
          );
        res.json({
          status: true,
          msg: "User record updated successfully",
          data: serviceRecord,
        });
      }
    }
  }
});

const deleteExisitingUser = asyncHandler(async (req, res) => {
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
      if (user.type !== "Admin") {
        res.status(200).json({
          status: false,
          msg: "You don't have the privileges to edit a user",
          data: null,
        });
      } else {
        await client
          .db("crm")
          .collection("users")
          .findOneAndDelete({ _id: ObjectId(_id) });
        res.json({
          status: true,
          msg: "User record deleted successfully",
        });
      }
    }
  }
});

const getAnalytics = asyncHandler(async (req, res) => {
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
      let userRecords = [];
      let totalLeads, totalServiceRecords, totalContacts;

      if (user.type === "Employee") {
        userRecords = await client
          .db("crm")
          .collection("users")
          .find({ type: "Employee" })
          .toArray();
      } else if (user.type === "Manager") {
        userRecords = await client
          .db("crm")
          .collection("users")
          .find({ type: { $ne: "Admin" } })
          .toArray();
      } else if (user.type === "Admin") {
        userRecords = await client
          .db("crm")
          .collection("users")
          .find({})
          .toArray();
      }

      totalLeads = await client.db("crm").collection("leads").countDocuments();

      totalServiceRecords = await client
        .db("crm")
        .collection("services")
        .countDocuments();

      totalContacts = await client
        .db("crm")
        .collection("contacts")
        .countDocuments();

      res.json({
        status: true,
        msg: "Analytics fetched successfully",
        data: {
          users: userRecords,
          totalLeads,
          totalServiceRecords,
          totalContacts,
        },
      });
    }
  }
});

module.exports = { updateExisitingUserRole, deleteExisitingUser, getAnalytics };
