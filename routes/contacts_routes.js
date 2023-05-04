const express = require("express");
const {
  addContactRecord,
  updateContactRecord,
  deleteContactRecord,
  getContactRecords,
} = require("../controllers/contacts_controller");
const { tokenVerifier } = require("../middleware/token_verifier");

const router = express.Router();
router.use(tokenVerifier);

router.post("/addContactRecord", addContactRecord);

router.post("/updateContactRecord", updateContactRecord);

router.post("/deleteContactRecord", deleteContactRecord);

router.post("/getContactRecords", getContactRecords);

module.exports = router;
