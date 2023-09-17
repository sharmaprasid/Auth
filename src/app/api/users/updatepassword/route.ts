// import decodeToken from "@/helpers/decodefToken";
// import { NextRequest, NextResponse } from "next/server";
// import User from "@/models/userModel";
// import DB from "@/utils/db";
// import bcrypt from "bcryptjs"

// DB();


  
// export async function POST(request: NextRequest) {
//   try {
//     const reqBody = await request.json();
//     const { password} = reqBody;
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//      const token = request.cookies.get("ftoken")?.value || "";
//     if (!token) {
//       throw new Error("Token not found in cookies");
//     }
// const userId=await decodeToken(token)
//     if (!userId) {
//       return NextResponse.json(
//         { error: "User ID is required" },
//         { status: 400 }
//       );
//     }

//     await User.findByIdAndUpdate(userId, { password: hashedPassword });

//     const response = NextResponse.json(
//       {
//         message: "Password Updated Successfully",
//         success: true,
//       },
//       { status: 200 }
//     );

//     response.cookies.delete("ftoken");

//     return response;
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
