"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3333;
app.get("/", (res, req) => {
  req.send("billo bagge billiyan \n");
});
app.listen(port, () => {
  console.log(`🚀 Listening on port: localhost:${port} `);
});
