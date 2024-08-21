import { Message } from "@/models/Message";

export interface ApiResponse {
  success: boolean;
  message: string; // response message
  isAcceptingMessages?: boolean;
  messages?: Array<Message>; // messages that user wants to send
}
