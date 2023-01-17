import jwt from "jsonwebtoken";
export default async function Authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.JWT_KEY, (err, user) => {
        if (err) return res.status(401).json("Token is not valid!");
        req.user = user;
        next();
      });
    } else {
      return res.status(409).json("You are not authenticated!");
    }
  } catch (error) {
    res.status(404).send({ error: "Authentication Failed!" });
  }
}

export function localVariable(req, res, next) {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
}
