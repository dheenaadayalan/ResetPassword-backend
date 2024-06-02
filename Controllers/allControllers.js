import bcrypt from "bcryptjs";
import User from "../Models/userSchema.js";

export const signup = async (req, res) => {
  try {
    const { userEmail, password,userName } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      userEmail: userEmail,
      password: hashPassword,
      verficationString: "",
      userName:userName,
    });
    await newUser.save();
    res
      .status(200)
      .json({ message: "User Registered Successfully", result: newUser,validedUser:true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Registration Failed Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { userEmail, password } = req.body;
    const userDetail = await User.findOne({ userEmail });
    if (!userDetail) {
      return res.status(401).json({ message: "User Not Found" });
    }
    const passwordMatch = await bcrypt.compare(password, userDetail.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res
      .status(200)
      .json({ message: "User Logged In Successfully", validedUser: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Login Failed Internal server error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { userEmail, newPassword, confirmPassword } = req.body;
    const userDetail = await User.findOne({ userEmail });
    const hashPassword = await bcrypt.hash(newPassword, 10);
    if (userDetail) {
      await User.updateOne(
        { userEmail: userEmail },
        {
          password: hashPassword,
        }
      );
      res.json({ message: "Password changed", changed: true });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Changing password Failed Internal server error" });
  }
};

export const getUserData = async (req, res) => {
  try {
    const { userEmail } = req.body;
    const userDetail = await User.findOne({ userEmail });
    if (userEmail) {
      res.json({ data: userDetail });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: " Failed to fetch data, Internal server error" });
  }
};
