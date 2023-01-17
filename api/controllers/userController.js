import UserModel from "../models/User.js";
export const getUser = async (req, res) => {
  const { username } = req.params;
  try {
    if (!username) return res.status(501).send({ error: "Invalid Username" });

    const user = await UserModel.findOne({ username });

    if (!user)
      return res.status(501).send({ error: "Could not find Username" });

    // hide password
    const { password, ...others } = user._doc;
    return res.status(200).send(others);
  } catch (error) {
    return res.status(404).send({ error: "Cannot find User" });
  }
};

export const updateUser = async (req, res) => {
  try {
    // const id = req.query.id;
    const { userId } = req.user;
    if (userId) {
      const body = req.body;

      const updatedUser = await UserModel.updateOne({ _id: userId }, body);

      return res.status(201).send({ msg: "User Record Updated!", updatedUser });
    }

    return res.status(401).send({ error: "User not Found!" });
  } catch (error) {
    return res.status(500).send(error);
  }
};
