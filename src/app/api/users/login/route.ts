import DB from "@/utils/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

DB();

interface RequestBody {

  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json() as RequestBody;
    const {  email, password } = reqBody;

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User Doesn't exist" }, { status: 400 });
    }


    const validpassword = await bcrypt.compare(password, user.password);
    if(!validpassword){
              return NextResponse.json({ message: "Credential doesn't match" }, { status: 400 });
    }

   //token data
   const tokenData={
    id:user._id,
    username:user.username,
    email:user.email
   }

const token= await jwt.sign(tokenData,process.env.SECRET!,{expiresIn:'1h'});

    const response= NextResponse.json({
      message: "Login Successfully",
      success: true,
      
     
    },{status:200});
    response.cookies.set("token",token,{httpOnly:true})
    return response;

  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
