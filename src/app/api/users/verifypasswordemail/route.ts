import DB from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import bcrypt from "bcryptjs"

DB();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token ,password} = reqBody;
    console.log(reqBody)

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(token);
    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpire: { $gt: Date.now() },
    });
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }
    console.log(user);
    user.password=hashedPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpire = undefined;
    await user.save();
    return NextResponse.json({
      message: "Password link Verified Successfully",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
