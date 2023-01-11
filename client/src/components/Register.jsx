import { Link } from "react-router-dom";
import styles from "../styles/Username.module.css";
import avatar from "../assets/profile.png";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { registerValidation } from "../helper/validate";
import { useState } from "react";
import convertToBase64 from "../helper/convert";

const Register = () => {
  const [file, setFile] = useState("");

  const formik = useFormik({
    initialValues: {
      username: "test123",
      email: "test@example.com",
      password: "",
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = Object.assign(values, { profile: file || "" });
      console.log(values);
    },
  });

  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen ">
        <div className={styles.glass} style={{ width: "45%" }}>
          <div className="title flex flex-col items-center">
            <h4 className="text-3xl font-bold">Register</h4>
            <span className="py-2 text-xl text-center text-gray-500">
              Happy to join you!
            </span>
          </div>
          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-3">
              <label htmlFor="profile">
                <img
                  src={file || avatar}
                  alt="avatar"
                  className={styles.profile_img}
                />
              </label>
              <input
                type="file"
                id="profile"
                name="profile"
                onChange={onUpload}
              />
            </div>
            <div className="textbox flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps("username")}
                type="username"
                placeholder="Enter your username"
                className={styles.textbox}
              />
              <input
                {...formik.getFieldProps("email")}
                type="email"
                placeholder="Enter your email"
                className={styles.textbox}
              />
              <input
                {...formik.getFieldProps("password")}
                type="password"
                placeholder="Enter your password"
                className={styles.textbox}
              />
              <button className={styles.btn} type="">
                Register
              </button>
            </div>
            <div className="text-center py-4">
              <span className="text-green-500">
                Already Registerd?
                <Link to="/" className="text-red-500 px-1">
                  Sign In
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
