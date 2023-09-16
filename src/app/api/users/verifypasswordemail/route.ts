import DB from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";

DB();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { ftoken } = reqBody;
    console.log(ftoken);
    const user = await User.findOne({
      forgotPasswordToken: ftoken,
      forgotPasswordTokenExpire: { $gt: Date.now() },
    });
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }
    console.log(user);
    
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
