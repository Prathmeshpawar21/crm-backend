const {
  addView,
  addDownload,
  getDownloads,
  addResponse,
} = require("../controllers/portfolio_controller");
const express = require("express");

const router = express.Router();

router.post("/addView", addView);

router.post("/addDownload", addDownload);

router.get("/getDownloads", getDownloads);

router.post("/addResponse", addResponse);

module.exports = router;
