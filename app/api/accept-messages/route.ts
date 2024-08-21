import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import { response } from "@/helpers/response";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const userId = user?._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Updated successfully",
        updatedUser,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Failed to update the user ", error);
    return Response.json(
      {
        success: false,
        message: "Failed to update the user",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const sessionUser: User = session?.user as User;

  if (!session || !session.user) {
    return response(false, "Not authenticated", 401);
  }

  const userId = sessionUser?._id;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return response(false, "User not found", 404);
    }

    return response(true, "User found", 200, {
      isAcceptingMessages: user.isAcceptingMessage,
    });
  } catch (error) {
    return response(false, "Failed to fetch isAcceptingMessage status", 500);
  }
}
