import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//body
// "username": "test123",
// "email": "test@example.com",
//     "password": "@Test1",
//     "firstname": "femi",
//     "lastname": "keem",
//     "mobile": 463663537,
//     "address": "Zone 4 new Site, Masaka",
//     "profile": ""

export const registerUser = async (req, res) => {
  const { username, email, password, profile } = req.body;
  try {
    const existUsername = new Promise((resolve, reject) => {
      UserModel.findOne({ username }, (error, user) => {
        if (error) reject(new Error(error));
        if (user) reject({ error: "Username exists!" });

        resolve();
      });
    });

    const existEmail = new Promise((resolve, reject) => {
      UserModel.findOne({ email }, (error, email) => {
        if (error) reject(new Error(error));
        if (email) reject({ error: "Email exists!" });

        resolve();
      });
    });

    Promise.all([existUsername, existEmail])
      .then(() => {
        if (password) {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              const user = new UserModel({
                username,
                email,
                password: hashedPassword,
                profile: profile || "",
              });
              user
                .save()
                .then((result) =>
                  res.status(201).send({ msg: "User registered successfully" })
                )
                .catch((error) => res.status(500).send(error));
            })
            .catch((error) =>
              res.status(500).send({ error: "Unable to hash password" })
            );
        }
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(400).send({ error: "Username not Found!" });
    }

    const verifyPassword = await bcrypt.compare(password, user.password);
    if (!verifyPassword)
      return res.status(400).send({ error: "Password Incorrect!" });

    //create accessToken
    const accessToken = await jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_KEY,
      {
        expiresIn: "3d",
      }
    );

    return res.status(201).send({
      msg: "User Login Succesfully",
      username: user.username,
      accessToken,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const authenticate = async (req, res) => {
  res.end();
};
