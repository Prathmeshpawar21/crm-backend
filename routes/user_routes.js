const express = require("express");
const {
  updateExisitingUserRole,
  deleteExisitingUser,
  getAnalytics,
} = require("../controllers/users_controller");
const { tokenVerifier } = require("../middleware/token_verifier");

const router = express.Router();

router.use(tokenVerifier);

router.post("/updateExisitingUserRole", updateExisitingUserRole);

router.post("/deleteExisitingUser", deleteExisitingUser);

router.post("/getAnalytics", getAnalytics);

module.exports = router;
