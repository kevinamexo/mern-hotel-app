require("dotenv").config({ path: __dirname + "/config.env" });
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const PORT = process.env.PORT;
console.log(PORT);

connectDB();
const app = express();

app.use(cors());
app.use("/api/v1/hotels/", require("./routes/bootcampRoutes"));

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
