import express from "express";

declare global {
  namespace Express {
    interface Request {
      id?: Record<string, any>;
    }
  }
}

// import Express from "express";
// declare global {
//   namespace Express {
//     interface Request {
//       id?: Record<string>;
//     }
//   }
// }

// declare global {
//   interface JwtPayload {
//     id?: Record<string>;
//   }
// }
