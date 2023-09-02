import decodeToken from "@/helpers/decodeToken";
import { NextRequest,NextResponse } from "next/server";
import User from "@/models/userModel";
import DB from "@/utils/db";
DB();
export async function GET(request:NextRequest){
try {
    
    const userId= await decodeToken(request);
    const user=await User.findOne({_id:userId}).select("-password -isAdmin ");
    return NextResponse.json({

        message:"user Found",
        data:user
    })
} catch (error:any) {
    return NextResponse.json({error:error.message},{status:500})
}
}