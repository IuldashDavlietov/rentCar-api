import type { HydratedDocument } from "mongoose";
import { mongoose } from "../configs/dbConnection";
import passwordEncrypt from "../helpers/passwordEncrypt";
import uniqueValidator from "mongoose-unique-validator";

// {
//     "username": "test",
//     "password": "1234",
//     "email": "test@site.com",
//     "isActive": true,
//     "isStaff": false,
//     "isAdmin": false
// }

// User Model:
export interface IUser {
  username: string;
  password: string;
  email: string;
  isActive: boolean;
  isStaff: boolean;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserBody = Pick<IUser, "username" | "password" | "email"> &
  Partial<Pick<IUser, "isActive" | "isStaff" | "isAdmin">>;

export type UserDocument = HydratedDocument<IUser>;

const UserSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      trim: true,
      required: true,
      set: passwordEncrypt,
      // selected:false
    },

    email: {
      type: String,
      trim: true,
      required: [true, "An Email address is required"],
      unique: [true, "There is this email. Email field must be unique"],
      validate: [
        (email: string) => {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
        },
        "Email format is not valid",
      ],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isStaff: {
      type: Boolean,
      default: false,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "users", timestamps: true },
);

UserSchema.plugin(uniqueValidator, {
  message: "This {PATH} is exist",
});

export default mongoose.model<IUser>("User", UserSchema);
