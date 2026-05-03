import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const dbConnection = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set. Add it to server/.env");
  }
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("DB connection established");
};

export const createJWT = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  const isProd = true;
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 1 * 24 * 60 * 60 * 1000,
  });

  return token;
};
