import { resend } from "./resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponce";

export async function sendVerificationEmail(
    email : string,
    username : string,
    verifyCode : string
) : Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification Code Mystry message',
            react : VerificationEmail({username , otp: verifyCode})
          });
        return {success : true , message : "Failed to send Verification Successfully"}
    } catch (emailError) {
        console.error("Error Sending Verification Email" , emailError);
        return {success : false , message : "Failed to send Verification Email"}
    }
}