const express = require("express");
require("dotenv").config();
const MongoConnection = require("./config/db");
const { errorHandler } = require("./middleware/error_handler");
const cors = require("cors");

const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(errorHandler);

//Created a singleton for later access
MongoConnection.connect();

app.listen(port, () => console.log(`Server started on port ${port}`));

var allowedDomains = [
  "https://crm-app-prathmesh.netlify.app",
  "http://localhost:3000",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedDomains.indexOf(origin) === -1) {
        var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

app.use("/onboarding", require("./routes/onboarding_routes"));
app.use("/services", require("./routes/service_routes"));
app.use("/leads", require("./routes/leads_routes"));
app.use("/contacts", require("./routes/contacts_routes"));
app.use("/users", require("./routes/user_routes"));
app.use("/portfolio", require("./routes/portfolio_routes.js"));
