import { resend } from "@/lib/resend";
import VerificationEmail from "@/templates/verificationEmails/email";
import { ApiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(
  email: string,
  userName: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [email],
      subject: "Complaint box: verify your account",
      react: VerificationEmail({ userName: userName, verifyCode: verifyCode }),
    });

    if (error) {
      console.log("\n\n error 000 -> ", error);
      return { success: false, message: "Error sending verification email" };
    }

    return {
      success: true,
      message: "Verification email sent",
    };
  } catch (emailError) {
    console.error("Error sending verification email --> ", emailError);
    return { success: false, message: "Error sending verification email" };
  }
}
