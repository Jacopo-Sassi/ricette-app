require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();


connectDB();


app.use(cors());
app.use(express.json());

app.use(require("./middleware/logger"));
const recipesRoutes = require("./routes/recipes");
app.use("/api/recipes", recipesRoutes);


app.get("/", (req, res) => {
  res.send("API Ricette attiva ✅");
});

const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server avviato su http://localhost:${PORT}`);
});
