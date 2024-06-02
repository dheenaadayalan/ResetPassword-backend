import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    userEmail: String,
    password: String,
    verficationString: String,
    userName:String,
});
  
const User = mongoose.model("User", userSchema);
  
export default User;