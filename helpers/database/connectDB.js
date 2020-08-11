const mongoose = require("mongoose");
const connectDB = () => {

  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DB Connection Success");
    })
    .catch((err) => {
      console.error(err);
    });
};
module.exports = connectDB;
