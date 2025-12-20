import { Request, Response, NextFunction } from "express";

// Example middleware exports
export const exampleMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Add your middleware logic here
  next();
};
