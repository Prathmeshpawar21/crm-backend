const express = require("express");
const {
  addLeadRecord,
  updateLeadRecord,
  deleteLeadRecord,
  getLeadRecords,
} = require("../controllers/leads_controller");
const { tokenVerifier } = require("../middleware/token_verifier");

const router = express.Router();
router.use(tokenVerifier);

router.post("/addLeadRecord", addLeadRecord);

router.post("/updateLeadRecord", updateLeadRecord);

router.post("/deleteLeadRecord", deleteLeadRecord);

router.post("/getLeadRecords", getLeadRecords);

module.exports = router;
