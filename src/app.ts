/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import express, { Request, Response } from "express";
import compression from "compression";  // compresses requests
import bodyParser from "body-parser";
import lusca from "lusca";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";
import bluebird from "bluebird";
import cookieParser from "cookie-parser";
import responseTime from "response-time";
import { MONGODB_URI } from "./utils/secrets";
import createDummyData from "./utils/dummy";
import logRequest from "./middlewares/logRequest";
import userRouter from "./controllers/user";
import participantRouter from "./controllers/participant";
import eventRouter from "./controllers/event";
import problemRouter from "./controllers/problem";
import auth from "./middlewares/auth";
// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl: string = MONGODB_URI;
mongoose.Promise = bluebird;
mongoose.connect(mongoUrl, {useNewUrlParser: true}).then(
  () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
).catch(err => {
  console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
  process.exit();
});

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(compression());
app.use(responseTime());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use(
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);


app.use(logRequest);

const apiRouter = express.Router();
apiRouter.use(auth);
apiRouter.use("/user", userRouter);
apiRouter.use("/participant", participantRouter);
apiRouter.use("/event", eventRouter);
apiRouter.use("/problem", problemRouter);

// test route to make sure everything is working
apiRouter.get("/", function(_, res) {
  console.log("apiRouter get at route /");
  res.json({
    "data": undefined,
    "message": "welcome to CTF API!"
  });
});

//Test
const publicDirectoryPath = path.join(__dirname, '../public')
//const viewsPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

//


apiRouter.get("/dummy", function(_, res) {
  console.log("Dummy router here");
  createDummyData()
    .then(() => {
      return res.json({message: "All created!"});
    });
});

app.use("/api", apiRouter);

// app.use(function(err: Error, req: Request, res: Response) {
//   console.log("Final resort error function");
//   const e = new Error();
//   e.message = err.message;
//   e.name = err.name;
//   res.status(500).send(e);
// });

export default app;