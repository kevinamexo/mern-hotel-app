require("dotenv").config({ path: __dirname + "/config.env" });
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const PORT = process.env.PORT;

connectDB();
const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/v1/hotels/", require("./routes/bootcampRoutes"));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
