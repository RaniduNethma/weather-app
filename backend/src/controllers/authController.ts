import { Request, Response } from "express";

// returns the verified identity from the access token
export const authHandler = (req: Request, res: Response) => {
  const payload = req.auth?.payload as Record<string, unknown> | undefined;
  res.status(200).json({
    sub: payload?.sub,
    scope: payload?.scope,
    tokenIssuer: payload?.iss,
    tokenAudience: payload?.aud,
  });
};
