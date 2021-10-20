import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authToken = request.headers.authorization;

  if (!authToken)
    return response.status(401).json({ errorCode: "invalid token" });

  // [0] 'Bearer' / [1] ...token as string
  const [, token] = authToken.split(" ");

  try {
    const { sub } = verify(token, process.env.JWT_SECRET);

    request.user_id = sub as string;

    return next();
  } catch (err) {
    return response.status(401).json({ errorCode: "expired token" });
  }
}
