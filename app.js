require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use("/v3", require("./routes/v3_api.js"));
app.use("/v2", require("./routes/v2_api.js"));

app.get("/", (req, res) => {
  res.send("NFL API Proxy");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
