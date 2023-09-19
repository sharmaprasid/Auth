import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

  const decodeToken = async (request: NextRequest) => {
  try {
    const token = request.cookies.get("token")?.value || "";
    if (!token) {
      throw new Error("Token not found in cookies");
    }

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
export default decodeToken;