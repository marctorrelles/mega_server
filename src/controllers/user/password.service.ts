import * as crypto from "crypto";
import config from "../../config/env/all";

export class PasswordService {
  public static encrypt(password: string): PasswordService {
      if (password.length < 8) { throw new Error("PasswordService must be at least 8 digits"); }
      return new PasswordService(password);
  }

  public readonly value: string;

  constructor(p: string) {
    this.value = crypto.pbkdf2Sync(p, config.passwordSalt, 1000, 64, "sha256").toString("base64");
  }
}
