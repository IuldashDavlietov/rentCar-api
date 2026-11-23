import dotenv from "dotenv";

dotenv.config({ quiet: true });

const requireEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) throw new Error(`Missing environment variable: ${name}`);

  return value;
};

export const env = {
  HOST: process.env.HOST ?? "127.0.0.1",
  PORT: Number(process.env.PORT ?? 8000),
  MONGODB: requireEnv("MONGODB"),
  SECRET_KEY: requireEnv("SECRET_KEY"),
  ACCESS_KEY: requireEnv("ACCESS_KEY"),
  REFRESH_KEY: requireEnv("REFRESH_KEY"),
  MAIL_USER: process.env.MAIL_USER ?? "",
  MAIL_PASS: process.env.MAIL_PASS ?? "",
};
