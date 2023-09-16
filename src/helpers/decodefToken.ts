import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

  const decodefToken = async (token:string) => {
  try {
   

    const decodedToken = jwt.verify(token, process.env.SECRET!);

   
    if (typeof decodedToken === "object" && "id" in decodedToken) {
      return decodedToken.id;
    } else {
      throw new Error("Invalid token structure");
    }
  } catch (error) {
   
    throw error;
  }
};
export default decodefToken;