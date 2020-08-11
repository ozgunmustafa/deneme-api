const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./helpers/database/connectDB");
const customErrorHandler = require("./middlewares/errors/customErrorHandler");
const routers = require("./routers");
const path = require("path");

//Enviroment Variables
dotenv.config({
  path: "./config/env/config.env",
});
//MongoDB Connection
connectDb();
const app = express();
const PORT = process.env.PORT;

//Express - Body Middleware
app.use(express.json());
//Routers Middleware
app.use("/api", routers);

//Error Handler
app.use(customErrorHandler);


app.use(express.static(path.join(__dirname,"public")));



app.listen(PORT, () => {
  console.log(`App started PORT:${PORT} :${process.env.NODE_ENV}`);
});
