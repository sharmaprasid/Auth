import mongoose from "mongoose";
const userSchema=new mongoose.Schema({

    username:{
        type:String,
        required:true ,
        unique:true
    },
    email:{
        type:String,
        required:true ,
        unique:true
    },
    password:{
        type:String,
  
    
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    forgotPasswordToken:String,
    forgotPasswordTokenExpire:Date,
    verifyToken:String,
    verifyTokenExpiry:Date,
    googleId: String,
    facebookId: String,
    twitterId: String,

    
})

const User= mongoose.models.User || mongoose.model("User",userSchema);
export default User;