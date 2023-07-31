const express = require("express");
// const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const morgan = require('morgan');

const testRouter = require("./routes/testRoute");
const userRoutes = require("./routes/userRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const statsRoutes = require("./routes/statsRoutes");
const CustomError = require("./utils/customError");
const globalErrorHandler = require("./controllers/errorController");

// Express App
const app = express();
app.enable("trust proxy");

// Global Middlewares
const allowedOrigin = process.env.NODE_ENV === "development" ? ["http://localhost:3000", "http://127.0.0.1:3000"] : ["https://example.com"];
const corsOptions = {
  origin: allowedOrigin,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(helmet());

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(compression());

if(process.env.NODE_ENV === "development") {
  app.use(morgan('dev'));
  app.use((req, res, next) => {
    console.log("Cookie: ",req.cookies);
    next()
  })
}

// ROUTES
app.use("/", testRouter);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/budget", budgetRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/stats", statsRoutes);

app.all("*", (req, res, next) => {
  next(new CustomError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error handling
app.use(globalErrorHandler);

module.exports = app;
