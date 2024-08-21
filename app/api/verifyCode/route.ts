import dbConnect from "@/lib/dbConect";
import UserModel from "@/models/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { userName, code } = await request.json();
    const decodedUserName = decodeURIComponent(userName);

    const user = await UserModel.findOne({
      userName,
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 500 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (!isCodeValid) {
      return Response.json(
        {
          success: false,
          message: "Invalid Code",
        },
        { status: 400 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Code expired",
        },
        { status: 400 }
      );
    }

    user.isVerified = true;
    await user.save();
    return Response.json(
      {
        success: true,
        message: "Account Verified successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error verifying user -> ", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 500 }
    );
  }
}
