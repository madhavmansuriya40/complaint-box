import dbConnect from "@/lib/dbConect";
import UserModel from "@/models/User";
import { z } from "zod";
import { userNameValidation } from "@/schemas/signUpSchema";

const UserNameQuerySchema = z.object({
  userName: userNameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      userName: searchParams.get("userName"),
    };

    //   validate with zod
    const result = UserNameQuerySchema.safeParse(queryParam);
    console.log("result -->", result);

    if (!result.success) {
      const userNameErrors = result.error.format().userName?._errors || [];

      return Response.json(
        {
          success: false,
          message:
            userNameErrors?.length > 0
              ? userNameErrors.join(",")
              : "Invalid Query Parameters",
        },
        { status: 400 }
      );
    }
    // username to check in the DB
    const { userName } = result.data;

    console.log("userName  --> ", userName);

    const usernameAlreadyExists = await UserModel.findOne({
      userName: userName,
      isVerified: true,
    });

    if (usernameAlreadyExists) {
      return Response.json(
        {
          success: false,
          message: "Username already taken, try another",
        },
        {
          status: 400,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Unique username",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username --> ", error);

    return Response.json(
      {
        success: false,
        message: "Error checking user name",
      },
      { status: 500 }
    );
  }
}
