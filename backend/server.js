///////////////////////////////////////////////////////////////
// Import dependencies
///////////////////////////////////////////////////////////////

const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

///////////////////////////////////////////////////////////////
// Import authentication packages
///////////////////////////////////////////////////////////////

const cookieParser = require("cookie-parser"); // Cookie parser for parsing cookies

///////////////////////////////////////////////////////////////
// Import security packages
///////////////////////////////////////////////////////////////
const mongoSanitize = require("express-mongo-sanitize"); // Mongo sanitize for preventing NoSQL injection
const helmet = require("helmet"); // Helmet for setting various HTTP headers for security
const { xss } = require("express-xss-sanitizer"); // XSS sanitizer for preventing XSS attacks
const rateLimit = require("express-rate-limit"); // Rate limiter for preventing brute force attacks
const hpp = require("hpp"); // HPP for preventing HTTP parameter pollution
const cors = require("cors"); // CORS for enabling Cross-Origin Resource Sharing

///////////////////////////////////////////////////////////////
// Load environment variables
///////////////////////////////////////////////////////////////

dotenv.config({ path: "./config/config.env" });

///////////////////////////////////////////////////////////////
// Rate limiter
///////////////////////////////////////////////////////////////

// const limiter = rateLimit({
//   windowsMS: 10 * 60 * 1000, // 10 minutes
//   max: 100,
// });

///////////////////////////////////////////////////////////////
// Initialize express app
///////////////////////////////////////////////////////////////

const app = express();
app.use(express.json());

///////////////////////////////////////////////////////////////
// Use the authentication packages
///////////////////////////////////////////////////////////////

app.use(cookieParser());

///////////////////////////////////////////////////////////////
// Use the security packages
///////////////////////////////////////////////////////////////

app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
// app.use(limiter);
app.use(hpp());
app.use(cors());

///////////////////////////////////////////////////////////////
// Connect to database
///////////////////////////////////////////////////////////////

connectDB();

///////////////////////////////////////////////////////////////
// Import routes
///////////////////////////////////////////////////////////////

const carProviders = require("./routes/carProviders");
const rentings = require("./routes/rentings");
const auth = require("./routes/auth");
const topUp = require("./routes/topUp");
const cars = require("./routes/cars");
const topUpTransactions = require("./routes/topUpTransactions");
const paymentTransactions = require("./routes/paymentTransactions");
const transactions = require("./routes/transactions");
///////////////////////////////////////////////////////////////
// Use routes
///////////////////////////////////////////////////////////////

app.use("/api/v1/carproviders", carProviders);
app.use("/api/v1/rentings", rentings);
app.use("/api/v1/auth", auth);
app.use("/api/v1/topUp", topUp);
app.use("/api/v1/cars", cars);
app.use("/api/v1/topuptransactions", topUpTransactions);
app.use("/api/v1/paymenttransactions", paymentTransactions);
app.use("/api/v1/transactions", transactions);
///////////////////////////////////////////////////////////////
// Set up server
///////////////////////////////////////////////////////////////

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.HOST} ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);

///////////////////////////////////////////////////////////////
// Handle unhandled rejections
///////////////////////////////////////////////////////////////

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});


const swaggerOptions={
  swaggerDefinition:{
      openapi : '3.1.0',
      info : {
          title : 'Yenkar API Library',
          version : '1.0.0',
          description : 'Yenkar Inc.'
      },
      servers:[
          {
              url : 'http://localhost:5000/api/v1'
          }
      ],
  },
  apis:['./routes/*.js'],
};

const swaggerDocs=swaggerJsDoc(swaggerOptions);
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocs));