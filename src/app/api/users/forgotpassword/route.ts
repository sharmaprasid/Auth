import DB from "@/utils/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/helpers/mail";
import jwt from "jsonwebtoken";

DB();

interface RequestBody {

  email: string;
 
}

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json() as RequestBody;
    const {  email } = reqBody;

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User Doesn't exist" }, { status: 400 });
    }


   
   
   const tokenData={
    id:user._id,
    username:user.username,
    email:user.email
   }

const token= await jwt.sign(tokenData,process.env.SECRET!,{expiresIn:'1h'});
 await sendMail({email,emailType:"reset",userId:user._id})
    const response= NextResponse.json({
      message: "Reset Password link send successfully ",
      success: true,
      
     
    },{status:200});
    response.cookies.set("ftoken",token,{httpOnly:true})
    return response;

  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
