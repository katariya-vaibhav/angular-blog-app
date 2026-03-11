import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({ path: "./.env" });

connectDB()
  .then(() => {
    app.get("/", (req, res) => {
      res.send("hello coders!");
    });

    app.listen(process.env.PORT || 3000, () => {
      console.log(`server runnig in port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGODB CONNECTION ERROR !!! ", error);
  });
