// Imports

const express = require('express');
const app = express();
const cors = require("cors");
require("dotenv").config();
require('db/db.js')
const authRoute = require("./routes/auth_routes");
const ProductRoute = require("./routes/product_routes");

// MiddleWare
app.use(express.json());
app.use(cors());
app.use("/auth", authRoute);
app.use("/products", ProductRoute);
app.use(require('./middleware/error_handling'))


// Server Run

app.listen(process.env.PORT, () => {
    console.log("Server running on port: " + process.env.PORT);
})