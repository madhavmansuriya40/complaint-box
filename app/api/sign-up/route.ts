import dbConnect from "@/lib/dbConect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { userName, email, password } = await request.json();

    const existingUserWithUserName = await UserModel.findOne({
      userName: userName,
      isVerified: true,
    });

    if (existingUserWithUserName) {
      return Response.json(
        {
          success: false,
          message: "Try different username, already taken",
        },
        { status: 400 }
      );
    }

    const existingUserWithEmail = await UserModel.findOne({
      email: email,
      isVerified: true,
    });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserWithEmail) {
      // if user already exists and the email is verified.
      if (existingUserWithEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "Try different email, already taken",
          },
          { status: 400 }
        );
      } else {
        // the user is registered but the password is not verified.
        const hashedPassword = await bcrypt.hash(password, 10);
        const verifyCodeExpiry = await new Date();
        verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1);

        existingUserWithEmail.verifyCode = verifyCode;
        existingUserWithEmail.verifyCodeExpiry = verifyCodeExpiry;
        existingUserWithEmail.password = hashedPassword;

        await existingUserWithEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const verifyCodeExpiry = await new Date();
      verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1);

      // creating user's object
      const newUser = new UserModel({
        userName: userName,
        email: email,
        password: hashedPassword,
        verifyCode: verifyCode,
        verifyCodeExpiry: verifyCodeExpiry,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
        createdAt: new Date(),
      });

      // saving user object to the DB
      await newUser.save();
    }

    // sending email
    const emailResponse = await sendVerificationEmail(
      email,
      userName,
      verifyCode
    );

    // if email service provider sends some error
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    // email send success case
    return Response.json(
      {
        success: true,
        message: "User registered successfully, please verify your email",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error registering the user -> ", error);
    return Response.json(
      { success: false, message: "Error registering user" },
      { status: 500 }
    );
  }
}
