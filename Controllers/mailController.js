import User from "../Models/userSchema.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

export const nodeMailer = async (req, res) => {
  try {
    const { userEmail,password } = req.body;
    const userDetail = await User.findOne({ userEmail });
    if (userDetail) {
      let length = 6;
      let result = "";
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < length) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
        counter += 1;
      }

      await User.updateOne(
        {userEmail:userEmail},
        {
            verficationString:result
        }
      )

      const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: process.env.EMAIL,
          pass: process.env.APP_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: "Hello, Your OTP",
        text: `Your OTP to re-set your password is ${result}`,
      };

      transporter.sendMail(mailOptions, (error, info) =>  {
        if (error) {
          console.error("Error sending email: ", error);
        } else {
          console.log("Email sent: ", info.response);
          res.json({ messages: info.response,mailSent:true });
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to send mail" });
  }
};

export const handelString = async(req,res)=>{
  try {
    const {userEmail, string} = req.body;
    const userDetail = await User.findOne({ userEmail });
    if(userDetail.verficationString == string){
      res.json({ messages: 'User verified', verfied:true });
    }else{
      res.json({ messages: 'User In-verified', verfied:false })
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to send verfiy mail" });
  }
}