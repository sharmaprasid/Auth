import mongoose from "mongoose";

const DB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URL!);

    if (connection) {
      console.log("Connected to the database!");
    }
    else{
        console.log("Error connecting to database")
    }
  } catch (error) {
    console.log("Something went wrong with Database");
    console.error(error);
  }
};

export default DB;
