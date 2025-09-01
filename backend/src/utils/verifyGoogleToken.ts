import { OAuth2Client } from "google-auth-library";
import { config } from "../config/env";

const client = new OAuth2Client(config.GOOGLE_CLIENT_ID);

export async function verifyGoogleToken(idToken: string) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: config.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.email || !payload.name) {
    throw new Error("Invalid Google token");
  }

  return {
    email: payload.email,
    name: payload.name,
    googleId: payload.sub,
  };
}
