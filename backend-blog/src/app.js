import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// user routers

import userRouter from "./routes/user.routes.js";
import blogRouter from "./routes/blog.routes.js";
import commenrRouter from "./routes/comment.routes.js";
import genAiRouter from "./routes/gen.routes.js";

app.use("/api/v2/users", userRouter);
app.use("/api/v2/Blog", blogRouter);
app.use("/api/v2/comment", commenrRouter);
app.use("/api/v2/GenAI", genAiRouter);

export { app };
