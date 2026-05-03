import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const dbConnection = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set.");
  }
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("DB connection established");
};

export const createJWT = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1 * 24 * 60 * 60 * 1000,
  });
  return token;
};
