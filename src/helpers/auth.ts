import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/userModel";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import DB from "@/utils/db";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/dashboard",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_APP_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_APP_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_APP_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_APP_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_APP_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_APP_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session }) {
      return session;
    },
    async signIn({ profile, account } ){
      DB()
        const name = (profile as { name?: string }).name;
       
      const email = (profile as { email?: string }).email;
         const id = (profile as { id?: string }).id || (profile as { sub?: string }).sub;
 
 const provider = account?.provider ?? "";
      try {
        let user;

    
        if (provider === "google") {
      user = await User.findOne({ googleId:id });
          if (!user) {
           user=await User.findOne({email})
           if(!user){user = new User({
              username: name,
              email,
              googleId: id,
              
            });

          }else{
           user.username=name;
          user.googleId=id; 
          }
         
      
           
            
          }
          else{

            user.username=name;
          }
          await user.save();
        } else if (provider === "facebook") {
         user = await User.findOne({ facebookId:id });
          if (!user) {
            user=await User.findOne({email})
            if(!user){
               user = new User({
              username: name,
              email,
              facebookId: id,
            });
            }else{
              user.username=name;
          user.facebookId=id;
            }
       
         
         
          } 
          else{
            user.username=name;
          }
          await user.save();
        } else if (provider === "github") {
          user = await User.findOne({ twitterId:id}); 
          
          if (!user) {
          user=await User.findOne({email})
          if(!user){
            user = new User({
              username: name,
              email,
              twitterId: id,
            });
           
          }else{
              user.username=name;
          user.twitterId=id;
          }
          
          
          }
          else{
            user.username=name;
          }
           await user.save()   
       
        }

        return true;
      } catch (error) {
        console.error(error);
        return false;
      }},
       async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
};
