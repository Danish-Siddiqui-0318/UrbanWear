const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
require("./config/db.js");
const authRoute = require("./routes/auth_routes");
const ProductRoute = require("./routes/product_routes");
const OrderRoute = require("./routes/order_routes");
const CategoryRoute = require("./routes/category_routes");
const AnnouncementRoute = require("./routes/announcement_routes");
const HeroSlideRoute = require("./routes/heroSlide_routes");

// MiddleWare
app.use(express.json());
app.use(cors());
app.use("/auth", authRoute);
app.use("/products", ProductRoute);
app.use("/orders", OrderRoute);
app.use("/categories", CategoryRoute);
app.use("/announcement", AnnouncementRoute);
app.use("/hero-slides", HeroSlideRoute);
app.use(require('./middleware/error_handling'))


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server running on port: " + PORT);
});
