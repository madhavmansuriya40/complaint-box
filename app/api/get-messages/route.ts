import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import { response } from "@/helpers/response";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;

  if (!session || !session.user) {
    return response(false, "Not authenticated", 401);
  }

  const userId = new mongoose.Types.ObjectId(user?._id);

  try {
    const user = await UserModel.aggregate([
      { $match: { id: userId } },
      { $unwind: "$messages" },
      {
        $sort: { "messages.createdAt": -1 },
      },
      {
        $group: { _id: "$_id", messages: { $push: "$messages" } },
      },
    ]);

    if (!user || user.length === 0) {
      return response(false, "User not found", 404);
    }
    return response(true, "Messages found", 200, {
      messages: user[0].messages,
    });
  } catch (error) {
    console.log("Fetching messages failed -> ", error);
    return response(false, "Fetching messages failed", 500);
  }
}
