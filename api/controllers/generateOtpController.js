import UserModel from "../models/User.js";
import otpGenerator from "otp-generator";
import bcrypt from "bcrypt";

export const generateOTP = async (req, res) => {
  try {
    req.app.locals.OTP = await otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    res.status(201).send({ OTP: req.app.locals.OTP });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { OTP } = req.query;
    if (parseInt(req.app.locals.OTP) === parseInt(OTP)) {
      req.app.locals.OTP = null; //reset OTP
      req.app.locals.resetSession = true; //start reset password session
      return res.status(201).send({ msg: "OTP verified successfully" });
    }
    return res.status(400).send({ msg: "Invalid OTP" });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const createResetSession = async (req, res) => {
  try {
    if (req.app.locals.resetSession) {
      return res.status(200).send({ flag: req.app.locals.resetSession });
    }

    return res.status(400).send({ error: "Session Expired" });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const resetPassword = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!req.app.locals.resetSession)
      return res.status(400).send({ error: "Session Expired" });

    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).send({ error: "Username not Found!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.updateOne(
      { username: user.username },
      { password: hashedPassword }
    );
    req.app.locals.resetSession = false;
    return res.status(201).send({ msg: "Password Updated Succesfully" });
  } catch (error) {
    console.log(error);
    return res.status(401).send(error);
  }
};
