import UserModel from "../models/User.js";
export async function verifyUser(req, res, next) {
  try {
    const { username } = req.method == "GET" ? req.query : req.body;

    let exist = await UserModel.findOne({ username });
    if (!exist) return res.status(404).send({ error: "Cannot find User" });
    next();
  } catch (error) {
    return res.status(404).send({ error: "Authentication Error" });
  }
}
