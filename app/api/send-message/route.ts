import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConect";

import { Message } from "@/models/User";
import { response } from "@/helpers/response";

export async function POST(request: Request) {
  await dbConnect();

  const { userName, content } = await request.json();

  try {
    const user = await UserModel.findOne({ userName });

    if (!user) {
      return response(false, "User not found", 404);
    }

    const isUserAcceptingMessages = user.isAcceptingMessage;
    if (!isUserAcceptingMessages) {
      return response(
        false,
        "User not accepting messages as of now, try again later",
        403
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);

    await user.save();
    return response(true, "Message sent successfully", 200);
  } catch (error) {
    console.log("Sending messages failed -> ", error);
    return response(false, "Sending messages failed", 500);
  }
}
