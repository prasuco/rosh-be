import express from "express";
import { authRouter } from "./routers/auth.router";

const app = express();
app.use(express.json());
const port = process.env.PORT || 3333;

app.get("/", (res, req) => {
  req.send("pratike chor \n");
});

app.use("/api/auth/", authRouter);

app.listen(port, () => {
  console.log(`🚀 Listening on port: localhost:${port} `);
});
