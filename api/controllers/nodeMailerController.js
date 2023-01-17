import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import dotenv from "dotenv";
dotenv.config();

let nodeConfig = {
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
};

let transporter = nodemailer.createTransport(nodeConfig);

let mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js/",
  },
});

export const registerMail = async (req, res) => {
  const { username, userEmail, text, subject } = req.body;

  //   body of the email
  let email = {
    body: {
      name: username,
      intro:
        text || "Welcome to my chat, We are most excited to have you on board",
      outro:
        "Need help or have questions? Just reply to this email, we would love to help",
    },
  };

  let emailBody = mailGenerator.generate(email);

  let message = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: subject || "Signup Successful",
    html: emailBody,
  };

  //send mail
  transporter
    .sendMail(message)
    .then(() => {
      return res
        .status(200)
        .send({ msg: "You should recieve an email from us" });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({ error });
    });
};
