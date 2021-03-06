import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

function logRequest(req: Request, res: Response, next: NextFunction) {
  // http://www.senchalabs.org/connect/responseTime.html
  const start = new Date();

  console.log("logRequest middleware entered ", (<any>res)._responseTime);
  if ((<any>res)._responseTime) {
    return next();
  }

  (<any>res)._responseTime = true;

  const ip = req.header("x-forwarded-for") || (req.connection && req.connection.remoteAddress) || "";

  // install a listener for when the response is finished
  res.on("finish", function () { // the request was handled, print the log entry
    console.log("Request handled");
    const responseTime = new Date().getTime() - start.getTime();
    const userId = res.locals.userId || "-";
    logger.info(`${ip} ${req.method} ${req.originalUrl} ${userId} ${res.statusCode} ${responseTime}ms`, {
      ip: ip,
      userId: userId,
      method: req.method,
      body: req.body,
      params: req.query,
      statusCode: res.statusCode,
      responseTime: responseTime
    });
  });

  console.log("Calling next ", next);
  // resume the routing pipeline,
  // let other middleware to actually handle the request
  next();
}

export default logRequest;
