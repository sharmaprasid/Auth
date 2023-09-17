import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";

export const sendMail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    const userUpdate = {};

    if (emailType === "verify") {
      await User.findByIdAndUpdate(userId,{verifyToken:hashedToken,verifyTokenExpiry : Date.now() + 3600000}) ;
      
    } else if (emailType === "reset") {
         await User.findByIdAndUpdate(userId,{forgotPasswordToken:hashedToken,forgotPasswordTokenExpire : Date.now() + 3600000})
      
    }

    await User.findByIdAndUpdate(userId, userUpdate);

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const subject =
      emailType === "verify" ? "Verify your email" : "Reset your password";
      const content=
      emailType==='verify'?`<p>Click<a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">Here</a>to ${subject} or copy and paste url in browser${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>`:
      `<p>Click<a href="${process.env.DOMAIN}/updatepassword?token=${hashedToken}">Here</a>to ${subject} or copy and paste url in browser${process.env.DOMAIN}/updatepassword?token=${hashedToken}</p>`

    const mailOptions = {
      from: "auth@gmail.com",
      to: email,
      subject: subject,
      html:content
    };

    // Send the email
    const mailresponse=await transporter.sendMail(mailOptions);
    return mailresponse;
  } catch (error:any) {
    throw new Error(error.message);
  }
};
