const express = require("express");
const {
  addServiceRequest,
  updateServiceRequest,
  deleteServiceRequest,
  getServiceRequests,
} = require("../controllers/service_controller");
const { tokenVerifier } = require("../middleware/token_verifier");

const router = express.Router();

router.use(tokenVerifier);

router.post("/addServiceRequest", addServiceRequest);

router.post("/updateServiceRequest", updateServiceRequest);

router.post("/deleteServiceRequest", deleteServiceRequest);

router.post("/getServiceRequests", getServiceRequests);

module.exports = router;
