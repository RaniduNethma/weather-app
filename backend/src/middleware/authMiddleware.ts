import { Request, Response, NextFunction } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import { env } from "../configs/envConfig";
import { AppError } from "../utils/appError";

// verifies the incoming Bearer token's signature
export const checkJwt = auth({
  issuerBaseURL: env.AUTH0_ISSUER_BASE_URL,
  audience: env.AUTH0_AUDIENCE,
});

const EMAIL_CLAIM = `${env.AUTH0_AUDIENCE.replace(/\/$/, "")}/email`;

export const requireAllowlistedEmail = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const payload = req.auth?.payload as Record<string, unknown> | undefined;
  const email = (
    payload?.[EMAIL_CLAIM] as string | undefined
  )?.toLocaleLowerCase();

  if (!email) {
    return next(new AppError("Access token is missing", 403));
  }

  if (!env.AUTH0_ALLOWED_EMAILS.includes(email)) {
    return next(
      new AppError(`User ${email} is not authorized to access this API.`, 403),
    );
  }

  return next();
};
