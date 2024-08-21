// Document is used for definging types as we are using typescript
import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string; // s small case in string
  createdAt: Date;
}

// Defining message schema

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String, // S cap in String
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

// Definig user interface
export interface User extends Document {
  userName: string; // s small case in string
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
  createdAt: Date;
}

// Defining user schema

const UserSchema: Schema<User> = new Schema({
  userName: {
    type: String, // S cap in String
    required: [true, "User name is reuqired"],
    trim: true,
    unique: true,
  },
  email: {
    type: String, // S cap in String
    required: [true, "Email is reuqired"],
    trim: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email address"],
  },
  password: {
    type: String, // S cap in String
    required: [true, "Password is reuqired"],
  },
  verifyCode: {
    type: String, // S cap in String
    required: [true, "Verify Code is reuqired"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify Code Expiry is reuqired"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

// first case
// get the existing model if there is already present -> if the application was already running
// mongoose.models <- checks the existing models and fetch the user model [mongoose.models.users]

// second case
// if the application was booting up for the first time and we need to create the model
// <User> <- specifies the type of the object
// mongoose.model<User>("User", UserSchema);

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
