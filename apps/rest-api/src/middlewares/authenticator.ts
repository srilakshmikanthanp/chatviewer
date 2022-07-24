import { Request, Response, NextFunction } from "express";
import { IJwtAuthPayload } from "../interfaces";
import * as jsonwebtoken from "jsonwebtoken";


/**
 * Authenticator middleware, used to authenticate the user.
 *
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export default async function authenticator(req: Request, res: Response, next: NextFunction) {
  //get the auth Hearer is set in the request
  const authHeader = req.headers.authorization;

  // if the auth header is not set
  if (!authHeader) {
    return res.status(401).json({
      error: "No token provided"
    });
  }

  // get the token from the header
  const token = authHeader.split(" ")[1];

  // if the token is not set
  if (!token) {
    return res.status(401).json({
      error: "No token provided"
    });
  }

  // verify the token
  try {
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET) as IJwtAuthPayload;
    res.locals.user_auth_payload = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      error: "Invalid token"
    });
  }
}
