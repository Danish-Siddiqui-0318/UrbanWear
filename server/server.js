
const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
require("./config/db.js");
const authRoute = require("./routes/auth_routes");
const ProductRoute = require("./routes/product_routes");
const OrderRoute = require("./routes/order_routes");
const CategoryRoute = require("./routes/category_routes");
const AnnouncementRoute = require("./routes/announcement_routes");
const HeroSlideRoute = require("./routes/heroSlide_routes");

// Standard MiddleWare
app.use(express.json({ limit: '10kb' })); 
app.use(cors());

// Security MiddleWare
app.use(helmet()); // Set security HTTP headers
app.use(hpp()); // Prevent parameter pollution

// Rate limiting for API
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use("/auth/login", limiter);
app.use("/auth/register", limiter);
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
