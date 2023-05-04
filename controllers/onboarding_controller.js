const asyncHandler = require("express-async-handler");
const MongoConnection = require("../config/db");
const { hashPassword, verifyPassword } = require("../config/crypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

var client = MongoConnection.connection;

const loginUser = asyncHandler(async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (!username || !password) {
    res.json({
      status: false,
      msg: "Invalid username or password",
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
    } else if (!user.isActive) {
      //Unauthorized
      res.status(401).json({
        status: false,
        msg: "User not active yet. Verify your email first",
        data: null,
      });
    } else {
      let userPassword = user.password;
      if (await verifyPassword(password, userPassword)) {
        //Password matched
        const token = jwt.sign(
          { username: user.username },
          process.env.SECRET_KEY,
          {
            expiresIn: 3600,
          }
        );
        delete user.password;
        res.json({
          status: true,
          msg: "Logged in successfully",
          data: user,
          token: token,
        });
      } else {
        //Password not matched
        res.status(404).json({
          status: false,
          msg: "Invalid username or password",
          data: null,
        });
      }
    }
  }
});

const signUp = asyncHandler(async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let type = req.body.type;
  if (!username || !password || !firstname) {
    res.json({
      status: false,
      msg: "Fill all required fields",
    });
  } else if (!["Admin", "Employee", "Manager"].includes(type)) {
    res.json({
      status: false,
      msg: "Please include correct user type",
    });
  } else {
    let user = await client
      .db("crm")
      .collection("users")
      .findOne({ username: username });
    if (user && user.isActive) {
      //Existing User found
      res.status(404).json({
        status: false,
        msg: "Email id already exists in our database",
        data: null,
      });
    } else {
      //Create New User
      let hashedPassword = await hashPassword(password);
      await client.db("crm").collection("users").insertOne({
        username,
        password: hashedPassword,
        firstname,
        lastname,
        isActive: false,
        type,
      });
      let user = await client
        .db("crm")
        .collection("users")
        .findOne({ username });

      const secret = user.password + "-" + user.username;
      delete user.password;
      const token = jwt.sign({ username: user.username }, secret, {
        expiresIn: 900, // 15 min
      });
      const authObject = {
        service: "Gmail",
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      };

      console.log(authObject);
      let transporter = nodemailer.createTransport(authObject);
      console.log(token);
      let mailOptions = {
        from: process.env.MAIL_USER,
        to: username,
        subject: "Verify your email address - CRM App",
        text: `Hi ${firstname},\n\nWe just need to verify your email address before you can access our CRM.\n\nVerify your email address ${req.get(
          "origin"
        )}/verifyEmail/${token}\nLink valid for 15 mins only!\n\nThanks! – CRM Developers Team
        \n
        `,
      };
      transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Email sent successfully");
        }
      });

      res.json({
        status: true,
        msg: "User Created Successfully",
        data: user,
        token,
      });
    }
  }
});

const verifyUser = asyncHandler(async (req, res) => {
  let username = req.body.username;
  let token = req.body.token;
  if (!username || !token) {
    res.json({
      status: false,
      msg: "Invalid Operation",
    });
  } else {
    let user = await client.db("crm").collection("users").findOne({ username });
    if (user) {
      let decodedToken = await jwt.verify(
        token,
        user.password + "-" + user.username,
        async (err, user) => {
          if (err) {
            res.json({
              status: false,
              msg: "Token is invalid or has been used",
            });
          } else {
            if (user.username === user.username) {
              await client
                .db("crm")
                .collection("users")
                .findOneAndUpdate({ username }, { $set: { isActive: true } });
              res.json({
                stauts: true,
                msg: "Account verified successfullly successfully",
              });
            } else {
              res.json({
                stauts: false,
                msg: "Token is invalid or has been expired",
              });
            }
          }
        }
      );
    } else {
      res.json({
        stauts: false,
        msg: "Invalid request",
      });
    }
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  let username = req.body.username;
  if (!username) {
    res.json({ status: false, msg: "Invalid email address" });
  } else {
    let user = await client.db("crm").collection("users").findOne({ username });
    if (!user) {
      res.json({ status: false, msg: "User not found!" });
    } else {
      const secret = user.password + "-" + user.username;
      const token = jwt.sign({ username: user.username }, secret, {
        expiresIn: 900, // 15 min
      });
      const authObject = {
        service: "Gmail",
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      };

      console.log(authObject);
      let transporter = nodemailer.createTransport(authObject);
      console.log(token);
      let mailOptions = {
        from: process.env.MAIL_UESR,
        to: username,
        subject: "CRM App",
        text: `Hello, you can create a new password for your account here
        \n
        ${req.get("origin")}/updatePassword/${token}`,
      };
      transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Email sent successfully");
        }
      });
      res.json({
        status: true,
        msg: "Verification Email Sent. Please verify first to use this application",
        data,
      });
    }
  }
});

const setPassword = asyncHandler(async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let token = req.body.token;
  if (!username || !token || !password) {
    res.json({
      status: false,
      msg: "Invalid Operation",
    });
  } else {
    let user = await client.db("crm").collection("users").findOne({ username });
    if (user) {
      let decodedToken = await jwt.verify(
        token,
        user.password + "-" + user.username,
        (err, user) => {
          if (err) {
            res.json({
              status: false,
              msg: "Token is invalid or has been used",
            });
          }
        }
      );
      if (user.username === user.username) {
        let hashedPassword = await hashPassword(password);
        await client
          .db("crm")
          .collection("users")
          .findOneAndUpdate(
            { username },
            { $set: { password: hashedPassword } }
          );
        res.json({
          stauts: true,
          msg: "Password updated successfully",
        });
      } else {
        res.json({
          stauts: false,
          msg: "Token is invalid or has been expired",
        });
      }
    }
  }
});

module.exports = { loginUser, signUp, forgotPassword, setPassword, verifyUser };
