// passwordEncrypt(password:string):

import { pbkdf2Sync } from "node:crypto";
import { env } from "../configs/env";

const loopCount = 10_000;
const charCount = 32;
const encType = "sha512";

export default function passwordEncrypt(password: string): string {
  return pbkdf2Sync(password, env.SECRET_KEY, loopCount, charCount, encType).toString("hex");
}
