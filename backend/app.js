const express = require("express");
// const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");

const testRouter = require("./routes/testRoute");
const userRoutes = require("./routes/userRoutes");
const CustomError = require("./utils/customError");
const globalErrorHandler = require("./controllers/errorController");

// Express App
const app = express();
app.enable("trust proxy");

// Global Middlewares
app.use(cors());
app.options("*", cors());
app.use(helmet());

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(compression());

// ROUTES
app.use("/", testRouter);
app.use("/api/v1/users", userRoutes);

app.all("*", (req, res, next) => {
  next(new CustomError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error handling
app.use(globalErrorHandler);

module.exports = app;
