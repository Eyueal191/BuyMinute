import {
    Resend
} from "resend";
import dotenv from "dotenv";
dotenv.config()
const resend = new Resend(process.env.RESEND_API)
const sendEmail = async ({
    to,
    subject,
    html
}) => {
    try {
        const data = await resend.emails.send({
            from: "ButMinute <onboarding@resend.dev>", // ✅ works immediately
            to,
            subject,
            html
        });
        return data;
    } catch (error) {
        throw new Error("failed to send email")
    }
}
export default sendEmail;