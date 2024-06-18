import mongoose from "mongoose";
import DB_Name from "./dbName";
import dotenv from "dotenv";
dotenv.config({
  path: "../env",
});
dotenv.config();

// Mongodb connection
const connectDB = (async () =>
  mongoose
    .connect(`${process.env.MONGODB_URI}`)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err))
    .then(() =>
      app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
    )
    .catch((err) => console.error(err)))();

// const connectDB = (async () =>
//   await mongoose
//     .connect(`${process.env.MONGODB_URI}/ ${DB_Name}`)
//     .then(() =>
//       app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
//     )
//     .catch((err) => console.error(err)))();

export default connectDB;
