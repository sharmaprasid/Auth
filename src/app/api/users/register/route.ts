import DB from "@/utils/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendMail } from "@/helpers/mail";

DB();

interface RequestBody {
  username: string;
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json() as RequestBody;
    const { username, email, password } = reqBody;

    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json({ message: "User Already Exists" }, { status: 400 });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    const savedUser = await newUser.save();
    console.log(savedUser);
  await sendMail({email,emailType:"verify",userId:savedUser._id})
    return NextResponse.json({
      message: "User Created Successfully",
      success: true,
      savedUser
    }, { status: 200 });

  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
