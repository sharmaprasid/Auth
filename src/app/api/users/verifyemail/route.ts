
import DB from "@/utils/db";
import  {NextRequest,NextResponse} from "next/server"
import User from "@/models/userModel";

DB() 
export async function POST(request:NextRequest){
    try {
        const reqBody=await request.json();
        const {token}=reqBody;
        console.log(token);
        const user=await User.findOne({verifyToken:token, verifyTokenExpiry:{$gt:Date.now()}})
        if(!user){
            return NextResponse.json({error:"Invalid token"},{status:400});
        }
        console.log(user);
        user.isVerified=true;
        user.verifyToken=undefined;
        user.verifyTokenExpiry=undefined;
        await user.save();
        return NextResponse.json({message:"Email  Verified Successfully",
        success:true})
    } catch (error:any) {
        return NextResponse.json({message:error.message},{status:500})
        
    }
    
}